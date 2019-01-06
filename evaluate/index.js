// page.evaluate意为在浏览器环境执行脚本，可传入第二个参数作为句柄，

const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.goto('https://www.google.com')
	const dimensions = await page.evaluate(() => {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight,
			deviceScaleFactor: window.deviceScaleFactor,
		}
	})
	console.log('视窗信息:', dimensions)
	const htmlHandle = await page.$('html')
	const html = await page.evaluate(body => body.outerHTML, htmlHandle)
	await htmlHandle.dispose()
	console.log(`html: ${html}`)
})()
