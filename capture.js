const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  const outputDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log('Triggering animation with wheel event...');
  await page.mouse.wheel({ deltaY: 100 });

  console.log('Capturing screenshots over 4 seconds...');
  for (let i = 0; i < 20; i++) {
    await page.screenshot({ path: path.join(outputDir, `frame_${i.toString().padStart(2, '0')}.png`) });
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('Done.');
  await browser.close();
})();