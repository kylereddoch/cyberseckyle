import {promises as fsPromises, existsSync} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

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

async function convertSvgToJpeg(svgPath, outputFilename, outputDir) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      // Render the current SVG every time. A JPEG's existence cannot prove it
      // matches a changed title/template, and passthrough may copy an old one.
      await sharp(await fsPromises.readFile(svgPath))
        .flatten({ background: '#0f0a1a' })
        .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
        .toFile(path.join(outputDir, `${outputFilename}.jpeg`));

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

export const svgToJpeg = async function ({ directories, dir } = {}) {
  const buildOutput = directories?.output || dir?.output;
  const outputDir = buildOutput
    ? path.join(buildOutput, 'assets/og-images')
    : socialPreviewImagesDir;
  if (!existsSync(outputDir)) {
    console.log('⚠ No OG images dir found');
    return;
  }

  const files = await fsPromises.readdir(outputDir);
  if (files.length === 0) {
    console.log('⚠ No images found on OG images dir');
    return;
  }

  const svgFiles = files.filter(filename => filename.endsWith('.svg'));
  const results = await runLimited(svgFiles, concurrency, async filename => {
    const outputFilename = filename.substring(0, filename.length - 4);
    const jpegFilename = `${outputFilename}.jpeg`;
    const distOutputPath = path.join(outputDir, jpegFilename);
    const sourceOutputPath = path.join(sourcePreviewImagesDir, jpegFilename);

    await convertSvgToJpeg(path.join(outputDir, filename), outputFilename, outputDir);

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
    `[og-images] ${counts.generated || 0} generated`
  );

  if (failures.length > 0) {
    const details = failures
      .map(result => `${result.filename}: ${result.error?.message || result.error}`)
      .join('\n');

    throw new Error(`Failed to generate ${failures.length} OG image(s):\n${details}`);
  }
};
