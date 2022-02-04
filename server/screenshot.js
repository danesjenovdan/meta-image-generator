const puppeteer = require('puppeteer');

const screenshotsInProgress = {};

async function takeScreenshotImpl(
  url,
  {
    selector = '#og-container',
    beforeScreenshot,
    width = 1200,
    height = 630,
    savePath,
  } = {}
) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: 'networkidle0' });

    if (beforeScreenshot) {
      await beforeScreenshot(page);
    }

    const elem = await page.$(selector);
    const image = await elem.screenshot({ path: savePath });
    return image;
  } finally {
    if (browser && browser.close) {
      browser.close();
    }
  }
}

async function takeScreenshot(url, options) {
  const { savePath } = options;
  if (!screenshotsInProgress[savePath]) {
    // set promise as being in progress
    screenshotsInProgress[savePath] = takeScreenshotImpl(url, options);
    // remove promise when it's done
    screenshotsInProgress[savePath].finally(() => {
      screenshotsInProgress[savePath] = null;
    });
  }
  return screenshotsInProgress[savePath];
}

module.exports = {
  takeScreenshot,
};
