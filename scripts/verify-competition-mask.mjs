import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const out = path.resolve("screenshots");
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const shots = [
    { name: "logo-desktop-08", width: 1440, height: 900, progress: 0.08 },
    { name: "logo-desktop-16", width: 1440, height: 900, progress: 0.16 },
    { name: "logo-desktop-22", width: 1440, height: 900, progress: 0.22 },
    { name: "logo-mobile-12", width: 390, height: 844, progress: 0.12 },
    { name: "logo-mobile-22", width: 390, height: 844, progress: 0.22 },
    { name: "desktop-55", width: 1440, height: 900, progress: 0.55 },
    { name: "desktop-65", width: 1440, height: 900, progress: 0.65 },
    { name: "desktop-78", width: 1440, height: 900, progress: 0.78 },
    { name: "mobile-55", width: 390, height: 844, progress: 0.55 },
    { name: "mobile-65", width: 390, height: 844, progress: 0.65 },
  ];

  const results = [];
  for (const shot of shots) {
    const page = await browser.newPage({
      viewport: { width: shot.width, height: shot.height },
    });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("http://localhost:3000", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForSelector("video", { timeout: 10000 });

    const introScroll = await page.evaluate(() => {
      const intro = document.querySelector("#top");
      return intro ? intro.getBoundingClientRect().height - window.innerHeight : 0;
    });
    await page.evaluate((y) => window.scrollTo(0, y), introScroll * shot.progress);
    await page.waitForTimeout(900);

    const file = path.join(out, `competition-mask-${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: false });

    const sample = await page.evaluate(() => {
      const el = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
      return {
        scrollY: Math.round(window.scrollY),
        pageHeight: document.documentElement.scrollHeight,
        centerTag: el?.tagName ?? null,
      };
    });

    results.push({ ...shot, file, errors, ...sample });
    await page.close();
  }

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
