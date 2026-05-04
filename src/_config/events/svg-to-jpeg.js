import {promises as fsPromises, existsSync} from 'node:fs';
import path from 'node:path';
import Image from '@11ty/eleventy-img';

const socialPreviewImagesDir = 'dist/assets/og-images';

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

  await Promise.all(
    files
      .filter(filename => filename.endsWith('.svg'))
      .map(async filename => {
        const outputFilename = filename.substring(0, filename.length - 4);
        const outputPath = path.join(socialPreviewImagesDir, `${outputFilename}.jpeg`);

        if (existsSync(outputPath)) {
          return;
        }

        await Image(path.join(socialPreviewImagesDir, filename), {
          formats: ['jpeg'],
          outputDir: socialPreviewImagesDir,
          filenameFormat: function (id, src, width, format) {
            return `${outputFilename}.${format}`;
          }
        });
      })
  );
};
