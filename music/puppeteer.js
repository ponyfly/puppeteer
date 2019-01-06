const fs = require('fs')
const { resolve } = require('path')
const puppeteer = require('puppeteer')
const { USERAGENT } = require('../tools/userAgent')

const start = async (url) => {
	const userAgent = USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]
	const browser = await puppeteer.launch({ headless: true })
	const page = await browser.newPage()
	await page.setUserAgent(userAgent)
	await page.goto(url, {
		waitUntil: 'domcontentloaded',
	})
	await page.waitForSelector('#g_search')
	const musicName = '爱情转移'
	await page.type('.txt.j-flag', musicName, { delay: 100 })
	await page.keyboard.press('Enter')
	const contentFrame = page.frames().find(frame => frame.name() === 'contentFrame')
	await contentFrame.waitForSelector('.srchsongst')
	const musicSrc = await contentFrame.$eval('.srchsongst', (element) => {
		const tarEle = element.querySelector('.item:nth-child(1) > .td:nth-child(2) > div > div > a')
		return tarEle.getAttribute('href')
	})
	await page.goto(`${url}${musicSrc}`)
	await contentFrame.waitForSelector('.g-bd4.f-cb')
	await contentFrame.waitForSelector('#flag_ctrl')
	await contentFrame.click('#flag_ctrl')
	// 获取歌词
	const musicLrc = await contentFrame.$eval('#lyric-content', (element) => {
		return element.innerText
	})
	// 写入歌词
	const writeStream = fs.createWriteStream(resolve(__dirname, './歌词.txt'))
	writeStream.write(musicLrc, 'utf-8')
	writeStream.end()

	// 获取评论数量
	const commentNum = await contentFrame.$eval('.sub.s-fc3', element => element.innerText)
	console.log(commentNum)

	// 获取评论数量
	const commentList = await contentFrame.$$eval('.itm', (element) => {
		const con = element.map(ele => ele.innerText.replace(/\s/g, ''))
		return con
	})
	console.log(commentList)
}

start('https://music.163.com/#')
