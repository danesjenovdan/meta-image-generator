const puppeteer = require('puppeteer');

async function takeScreenshot(
  url,
  { selector = '#og-container', width = 1200, height = 630, savePath } = {}
) {
  let browser = null;
  try {
    browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: 'networkidle0' });

    const elem = await page.$(selector);
    const image = await elem.screenshot({ path: savePath });
    return image;
  } finally {
    if (browser && browser.close) {
      browser.close();
    }
  }
}

module.exports = {
  takeScreenshot,
};
