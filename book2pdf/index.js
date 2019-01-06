const path = require('path')
const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const { USERAGENT } = require('../tools/userAgent')

const BASE_URL = 'http://www.ituring.com.cn'
const SHELF_URL = 'http://www.ituring.com.cn/user/shelf'
const LOGIN_URL = `http://account.ituring.com.cn/log-in?returnUrl=${encodeURIComponent(SHELF_URL)}`

const start = async (userName, password, saveDir = './books/') => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	const viewport = {
		width: 1376,
		height: 768,
	}
	page.setViewport(viewport)
	// 获取所有的书
	await page.goto(LOGIN_URL)
	await page.waitForSelector('#loginForm')
	await page.type('#Email', userName)
	await page.type('#Password', password)
	await page.click('#loginForm  input[type="submit"]')
	await page.waitForSelector('.block-items')
	const books = await page.$eval('.block-items', (element) => {
		const booksele = element.querySelectorAll('.block-item')
		const bookselearr = Array.from(booksele)
		const books = bookselearr.map((item) => {
			const a = item.querySelector('.book-img a')
			return {
				title: a.getAttribute('title'),
				href: a.getAttribute('href'),
			}
		})
		return books
	})
	console.log(`总共有 ${books.length} 本书`)
	// 获取书的所有章节目录
	const articlePromises = books.map(async (book) => {
		const page = await browser.newPage()
		await page.setViewport(viewport)
		await page.goto(`${BASE_URL}${book.href}`)
		await page.waitForSelector('.bookmenu')
		const articles = await page.$eval('.bookmenu table tbody', (element) => {
			const articlesEle = element.querySelectorAll('tr')
			const articlesEleArr = Array.from(articlesEle)
			const articles = articlesEleArr.map((element) => {
				const a = element.querySelector('td a')
				return {
					title: a.innerText.trim(),
					href: a.getAttribute('href'),
				}
			})
			return articles
		})
		articles.forEach(article => article.bookTitle = book.title)
		page.close()
		return articles
	})
	let results = await Promise.all(articlePromises)
	results = results.reduce((preArr, nowArr) => preArr.concat(nowArr));
	// console.log(results)
	// 获取章节内容
	(async () => {
		for (const article of results) {
			try {
				// 新建文件
				const dirPath = path.resolve(__dirname, `${saveDir}${article.bookTitle}`)
				const fileName = `${article.title}.pdf`
				const filePath = `${dirPath}/${fileName}`
				mkdirp.sync(dirPath)
				// 打开新页面
				const page = await browser.newPage()
				await page.setViewport(viewport)
				await page.setUserAgent(USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))])
				await page.waitFor(Math.floor(Math.random() * 1000))
				await page.goto(`${BASE_URL}/${article.href}`, {
					timeout: 100000,
					waitUntil: 'load',
				})
				await page.waitForSelector('.article-detail')
				await page.$eval('body', (element) => {
					element.querySelector('.layout-head').style.display = 'none'
					element.querySelector('#footer').style.display = 'none'
					element.querySelector('#toTop').style.display = 'none'
					element.querySelector('.book-page .side').style.display = 'none'
				})
				await page.emulateMedia('screen');
				await page.pdf({
					path: filePath,
					format: 'A4',
				})
				console.log(`保存成功: ${filePath}`)
				await page.close()
			} catch(err) {
				console.log(err)
			}
		}
	})()
	// const articleContentPromise = results.map(async (article) => {
	// 	// 新建文件
	// 	const dirPath = `${saveDir}${article.bookTitle}`
	// 	const fileName = `${article.title}.pdf`
	// 	const filePath = `${dirPath}/${fileName}`
	// 	mkdirp.sync(filePath)
	// 	// 打开新页面
	// 	const page = await browser.newPage()
	// 	await page.setViewport(viewport)
	// 	await page.setUserAgent(USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))])
	// 	await page.waitFor(Math.floor(Math.random() * 300))
	// 	await page.goto(`${BASE_URL}/${article.href}`, {
	// 		timeout: 100000,
	// 		waitUntil: 'load',
	// 	})
	// 	await page.waitForSelector('.article-detail')
	// 	await page.$eval('body', (element) => {
	// 	  element.querySelector('.layout-head').style.display = 'none'
	// 	  element.querySelector('#footer').style.display = 'none'
	// 	  element.querySelector('#toTop').style.display = 'none'
	// 	  element.querySelector('.book-page .side').style.display = 'none'
	// 	})
	// 	await page.close()
	// })
}

start('747048047@qq.com', 'tl1qqoo125.')
