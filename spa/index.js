const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors')

const iPhone = devices['iPhone 6']

const start = async () => {
	const browser = await puppeteer.launch({ headless: false })
	const context = browser.defaultBrowserContext()
	await context.overridePermissions('https://h5.ele.me', ['geolocation'])
	const page = await browser.newPage()
	// 模拟移动设备
	await page.emulate(iPhone)
	await page.setGeolocation({ longitude: 116.332, latitude: 39.993 })
	await page.goto('https://h5.ele.me')
	await page.waitForSelector('.search-wrapper .search')
	await page.tap('.search-wrapper .search')
	await page.waitForSelector('input[type="search"]')
	await page.type('input[type="search"]', '奶茶', {
		delay: 100,
	})
	await page.waitForSelector('.app-3GmD-_1 ul')
	await page.tap('.app-3GmD-_1 ul')
}

start()
