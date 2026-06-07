const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to live site...");
  await page.goto('https://bmw-showcase-nu.vercel.app', { waitUntil: 'networkidle2' });

  // Check for console errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log("Capturing Hero (Scroll 0)...");
  await page.screenshot({ path: 'screenshots/verify-hero-scroll-0.png' });

  console.log("Scrolling to 50% of Hero...");
  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight * 2.5);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/verify-hero-scroll-50.png' });

  console.log("Scrolling to Navbar entrance (90%)...");
  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight * 4.8);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/verify-navbar-entrance.png' });

  console.log("Scrolling to end of Hero (100%)...");
  await page.evaluate(() => {
    window.scrollTo(0, window.innerHeight * 5.2);
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'screenshots/verify-navbar-complete.png' });

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
