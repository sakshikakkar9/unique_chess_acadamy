import { chromium } from 'playwright';
import fs from 'fs';

if (!fs.existsSync('verification')) {
  fs.mkdirSync('verification');
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  const pages = [
    { name: 'home', url: 'http://localhost:8080/' },
    { name: 'courses', url: 'http://localhost:8080/courses' },
    { name: 'events', url: 'http://localhost:8080/events' },
    { name: 'gallery', url: 'http://localhost:8080/gallery' },
    { name: 'contact', url: 'http://localhost:8080/contact' }
  ];

  for (const p of pages) {
    console.log(`Visiting ${p.url}...`);
    await page.goto(p.url, { waitUntil: 'networkidle' });

    // Trigger animations by scrolling
    await page.evaluate(() => {
      window.scrollTo(0, 400);
    });

    await page.waitForTimeout(1000); // Wait for animations

    await page.screenshot({ path: `verification/${p.name}_final.png` });
  }

  await browser.close();
})();
