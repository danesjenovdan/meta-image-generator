import { stat } from 'node:fs/promises';

async function fileExceededMaxAge(imagePath, maxAge) {
  if (maxAge > 0) {
    const stats = await stat(imagePath);
    const imageAge = Date.now() - stats.mtimeMs;
    return imageAge > maxAge;
  }
  return false;
}

// eslint-disable-next-line import/prefer-default-export
export { fileExceededMaxAge };
