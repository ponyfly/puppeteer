const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const puppeteer = require('puppeteer')
const rm = promisify(require('rimraf'))
const { USERAGENT } = require('../tools/userAgent')


const start = async () => {
	const browser = await puppeteer.launch({ headless: false })
	const userAgent = USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]
	const viewport = {
		width: 1920,
		height: 1080,
	}
	const page = await browser.newPage()
	await page.setUserAgent(userAgent)
	await page.setViewport(viewport)
	await page.goto('http://huziketang.mangojuice.top/books/react/')
	const outpath = path.resolve(__dirname, './reactbookmini')
	const isExist = fs.existsSync(outpath)
	const mkdirOutputpath = () => {
	  try {
		  fs.mkdirSync(outpath)
		  console.log('mkdir successful!')
	  } catch (e) {
		  console.log('mkdir failed')
	  }
	}
	if (!isExist) {
		mkdirOutputpath()
	} else {
		await rm(outpath)
		mkdirOutputpath()
	}
	await page.pdf({
		path: path.resolve(outpath, './0.react小书.pdf'),
		format: 'A4',
		displayHeaderFooter: true,
		margin: {
			top: 100,
			right: 100,
			bottom: 100,
			left: 100,
		},
	})
	await page.waitForSelector('.table-of-content')
	const links = await page.$$eval('.table-of-content li a', (elements) => {
		elements = Array.from(elements)
		return elements.map((ele) => {
			return {
				href: ele.getAttribute('href'),
				title: ele.innerText,
			}
		})
	})
	// 获取章节pdf
	const getpdfs = async (links) => {
	  let nowIndex = 2
		const nowlinks = []
		const getpdf = async (link) => {
			const userAgent = USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]
		  const page = await browser.newPage()
			await page.setViewport(viewport)
			await page.setUserAgent(userAgent)
			await page.goto(`http://huziketang.mangojuice.top${link.href}`, {
				waitUntil: 'networkidle2',
			})
			await page.waitForSelector('#table-of-content')
			await page.evaluate(() => {
			  document.querySelector('#table-of-content').style.display = 'none'
			})
			await page.waitForSelector('.post')
			await page.pdf({
				path: path.resolve(outpath, `./${link.title}.pdf`),
				format: 'A4',
				displayHeaderFooter: true,
				margin: {
					top: 100,
					right: 100,
					bottom: 100,
					left: 100,
				},
			})
			console.log(`保存成功${link.title}`)
			await page.close()
			if (nowIndex < links.length) {
				nowlinks.push(getpdf(links[nowIndex++]))
			}
		}
		for (let i = 0; i < nowIndex; i++) {
			nowlinks.push(getpdf(links[i]))
		}
	}
	await getpdfs(links)
}
start()
