const cheerio = require('cheerio')
const axios = require('axios')
const { USERAGENT } = require('../tools/userAgent')

const start = async (url) => {
	const userAgent = USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]
	const options = {
		url,
		method: 'get',
		headers: {
			'User-Agent': userAgent,
		},
	}
	const data = await axios(options)
	if (data.status !== 200) return 'err'
	const $ = cheerio.load(data.data)
	const liDoms = $('#default > div > div > div > div > section > div:nth-child(2) > ol > li')
	const result = []
	liDoms.each((i, liDom) => {
		const a = $(liDom).find('.product_pod h3 a')
		const price = $(liDom).find('.product_price .price_color')
		result.push({
			title: a.attr('title'),
			price: price.text(),
		})
	})
	return result
}
console.time('cheerio')
start('http://books.toscrape.com/').then((res) => {
	console.log(res)
	console.timeEnd('cheerio')
})
