const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const { randomUserAgent } = require('../../tools/getUserAgent')

const userAgent = randomUserAgent()
const viewport = {
	width: 1920,
	height: 1000,
}

const start = async (url, grabPage) => {
	let hasGrabPage = 0
	let jokesTotal = []
  const browser = await puppeteer.launch({
	  args: ['--disable-web-security'],
	  headless: false,
	  // devtools: true,
  })
	const page = await browser.newPage()
	await page.setUserAgent(userAgent)
	await page.setViewport(viewport)
	await page.goto(url, {
		waitUntil: 'networkidle0',
	})
	const go = async () => {
		await page.waitForSelector('.m-wrap>.m-con-l')
		const jokes = await page.$$eval('.card-wrap > .card > .card-feed > .content', (elements) => {
			elements = Array.from(elements)
			return elements.map((ele) => {
				const nickName = ele.querySelector('.info .name').innerText
				const title = ele.querySelector('p.txt').firstChild.nodeValue.replace('\n', '').trim()
				let actionData = ele.querySelector('.thumbnail>a').getAttribute('action-data')
				actionData = decodeURIComponent(actionData)
				// const src = `https:${actionData.match(/video_src.+(?=&cover_img)/)[0].replace('video_src=', '')}`
				const src = `https:${actionData.match(/video_src=.+\,video/)[0].replace('video_src=', '')}`
				return {
					nickName,
					title,
					src,
				}
			})
		})
		const writeStream = fs.createWriteStream(path.resolve(__dirname, `./joke${hasGrabPage + 1}.json`))
		writeStream.write(JSON.stringify(jokes, undefined, 2), 'utf-8')
		writeStream.end()
		jokesTotal = jokesTotal.concat(jokes)
		hasGrabPage++
		if (grabPage === 1 || hasGrabPage === grabPage) {
			await page.close()
			await browser.close()
			return jokesTotal
		}
		await page.click('.m-page .next')
		await go()
	}
	await go()
}

module.exports = {
	start,
}
