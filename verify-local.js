const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Listen for console logs and errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  console.log("Navigating to http://localhost:3000...");
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000)); // wait for client-side hydration
    
    console.log("Taking screenshot at Scroll 0...");
    await page.screenshot({ path: 'screenshots/local-hero-scroll-0.png' });

    console.log("Scrolling to 50% of Hero...");
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 2.5);
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshots/local-hero-scroll-50.png' });

    console.log("Scrolling to 90%...");
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 4.6);
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshots/local-hero-scroll-90.png' });

    console.log("Scrolling to 100% (Navbar complete)...");
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 5.2);
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: 'screenshots/local-hero-scroll-100.png' });

    const images = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        visible: img.offsetParent !== null,
        opacity: window.getComputedStyle(img).opacity,
        html: img.outerHTML
      }));
    });
    console.log("Found images:", JSON.stringify(images, null, 2));

  } catch (error) {
    console.error("Navigation failed:", error);
  } finally {
    await browser.close();
    console.log("Done.");
  }
})();
