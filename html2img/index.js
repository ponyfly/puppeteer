const puppeteer = require('puppeteer');
const path = require('path');

(async function createIndex() {
	console.time('grab')
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	// page.setViewport({
	// 	width: 1024,
	// 	height: 1600,
	// })
	await page.goto('https://www.baidu.com')
	await page.screenshot({
		path: path.resolve(__dirname, './imgs/google.jpg'),
		// clip: {
		// 	x: 0,
		// 	y: 0,
		// 	width: 750,
		// 	height: 600,
		// },
	})
	// await browser.close()
	console.timeEnd('grab')
}())

// 1629 1610 1654 1940 1666 1829 1805 1657 1901 1844
// average 1748 , faster Than phantomjs:700ms

//opentime
//puppeteer 286 319 257 257 241 241 245 270  average 264
//phantom (1368+1359+1349+1352+1344+1358+1351+1354) average 1354
