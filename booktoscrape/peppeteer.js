const puppeteer = require('puppeteer')
const { USERAGENT } = require('../tools/userAgent')

const start = async (url) => {
	const userAgent = USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	await page.setUserAgent(userAgent)
	await page.goto(url, {
		waitUntil: 'domcontentloaded',
	})
	const result = await page.evaluate(() => {
	  let liDoms = document.querySelectorAll('#default > div > div > div > div > section > div:nth-child(2) > ol > li')
		liDoms = Array.from(liDoms)
		const books = liDoms.map((liDom) => {
			const a = liDom.querySelector('.product_pod h3 a')
			const price = liDom.querySelector('.product_price .price_color')
			return {
				title: a.getAttribute('title'),
				price: price.innerText,
			}
		})
		return books
	})
	await browser.close()
	return result
}

console.time('peppeteer')
start('http://books.toscrape.com/').then((res) => {
	console.log(res)
	console.timeEnd('peppeteer')
})
