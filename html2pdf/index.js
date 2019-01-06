const puppeteer = require('puppeteer')

async function createIndex() {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://www.google.com')
	await page.pdf({
		path: './pdf/google.pdf',
		format: 'A4',
	})
	await browser.close()
}
createIndex()
