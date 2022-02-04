const { stat } = require('fs-extra');

async function fileExceededMaxAge(imagePath, maxAge) {
  if (maxAge > 0) {
    const stats = await stat(imagePath);
    const imageAge = Date.now() - stats.mtimeMs;
    return imageAge > maxAge;
  }
  return false;
}

module.exports = {
  fileExceededMaxAge,
};
