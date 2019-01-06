const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	page.setViewport({
		width: 1376,
		height: 768,
	});
	await page.goto('https://www.google.com', {
		waitUntil: 'load',
	})

	await page.type('.gLFyf', '鱼香肉丝', { delay: 100 })

	await page.keyboard.press('Enter')
})()
