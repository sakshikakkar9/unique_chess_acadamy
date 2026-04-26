import asyncio
from playwright.async_api import async_playwright

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Home Page
        await page.goto('http://localhost:8081')
        await asyncio.sleep(2)  # Wait for animations
        await page.screenshot(path='preview/home.png', full_page=True)

        # Courses Page
        await page.goto('http://localhost:8081/courses')
        await asyncio.sleep(2)
        await page.screenshot(path='preview/courses.png', full_page=True)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(capture())
