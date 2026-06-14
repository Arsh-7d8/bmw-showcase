/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require('playwright');

(async () => {
  const browser = await puppeteer.chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.bmw-m.com/en/index.html', { waitUntil: 'networkidle' });
  
  const media = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img')).map(img => img.src);
    const videos = Array.from(document.querySelectorAll('video source')).map(v => v.src);
    const bgVideos = Array.from(document.querySelectorAll('video')).map(v => v.src).filter(src => src);
    return { images, videos: [...videos, ...bgVideos] };
  });

  console.log(JSON.stringify(media, null, 2));
  await browser.close();
})();
