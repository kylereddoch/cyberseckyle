import {promises as fsPromises, existsSync} from 'node:fs';
import path from 'node:path';
import Image from '@11ty/eleventy-img';

const socialPreviewImagesDir = 'dist/assets/og-images';
const sourcePreviewImagesDir = 'src/assets/og-images';
const writeSourceImages = String(process.env.OG_IMAGE_WRITE_SOURCE || '').toLowerCase() === 'true';

function getPositiveInteger(value, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number) || number < 1) {
    return fallback;
  }

  return Math.floor(number);
}

const concurrency = getPositiveInteger(process.env.OG_IMAGE_CONCURRENCY, 4);
const maxAttempts = getPositiveInteger(process.env.OG_IMAGE_MAX_ATTEMPTS, 2);

async function fileExists(file) {
  try {
    await fsPromises.access(file);
    return true;
  } catch {
    return false;
  }
}

async function runLimited(items, limit, task) {
  const results = [];
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      try {
        results[currentIndex] = await task(items[currentIndex]);
      } catch (error) {
        results[currentIndex] = {
          status: 'failed',
          filename: items[currentIndex],
          error
        };
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker())
  );

  return results;
}

async function convertSvgToJpeg(svgPath, outputFilename) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await Image(svgPath, {
        formats: ['jpeg'],
        outputDir: socialPreviewImagesDir,
        filenameFormat: function (id, src, width, format) {
          return `${outputFilename}.${format}`;
        }
      });

      return;
    } catch (error) {
      lastError = error;
      console.warn(
        `[og-images] ${outputFilename}.jpeg failed on attempt ${attempt}/${maxAttempts}: ${error?.message || error}`
      );
    }
  }

  throw lastError;
}

export const svgToJpeg = async function () {
  if (!existsSync(socialPreviewImagesDir)) {
    console.log('⚠ No OG images dir found');
    return;
  }

  const files = await fsPromises.readdir(socialPreviewImagesDir);
  if (files.length === 0) {
    console.log('⚠ No images found on OG images dir');
    return;
  }

  const svgFiles = files.filter(filename => filename.endsWith('.svg'));
  const results = await runLimited(svgFiles, concurrency, async filename => {
    const outputFilename = filename.substring(0, filename.length - 4);
    const jpegFilename = `${outputFilename}.jpeg`;
    const distOutputPath = path.join(socialPreviewImagesDir, jpegFilename);
    const sourceOutputPath = path.join(sourcePreviewImagesDir, jpegFilename);

    if (await fileExists(distOutputPath)) {
      return { status: 'skipped' };
    }

    if (await fileExists(sourceOutputPath)) {
      await fsPromises.copyFile(sourceOutputPath, distOutputPath);
      return { status: 'copied' };
    }

    await convertSvgToJpeg(path.join(socialPreviewImagesDir, filename), outputFilename);

    if (writeSourceImages) {
      await fsPromises.mkdir(sourcePreviewImagesDir, { recursive: true });
      await fsPromises.copyFile(distOutputPath, sourceOutputPath);
    }

    return { status: 'generated' };
  });

  const counts = results.reduce(
    (summary, result) => {
      summary[result.status] = (summary[result.status] || 0) + 1;
      return summary;
    },
    {}
  );
  const failures = results.filter(result => result.status === 'failed');

  console.log(
    `[og-images] ${counts.skipped || 0} cached, ${counts.copied || 0} copied, ${counts.generated || 0} generated`
  );

  if (failures.length > 0) {
    const details = failures
      .map(result => `${result.filename}: ${result.error?.message || result.error}`)
      .join('\n');

    throw new Error(`Failed to generate ${failures.length} OG image(s):\n${details}`);
  }
};
