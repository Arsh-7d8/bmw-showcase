const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://bmw-showcase-2r7izblvx-arshkar98exp-9134s-projects.vercel.app', { waitUntil: 'networkidle2' });
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      visible: img.offsetParent !== null,
      opacity: window.getComputedStyle(img).opacity,
      rect: img.getBoundingClientRect()
    }));
  });
  console.log("Found images:", JSON.stringify(images, null, 2));
  await browser.close();
})();
