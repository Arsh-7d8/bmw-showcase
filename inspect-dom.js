const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log("PAGE HTML LENGTH:", html.length);
  console.log("CONTAINS HERO:", html.includes('id="top"'));
  console.log("CONTAINS IMG:", html.includes('<img'));
  console.log("CONTAINS BMW:", html.includes('bmw-logo.png'));
  await browser.close();
})();
