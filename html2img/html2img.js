console.time('html2img')
const puppeteer = require('puppeteer');
const fs = require('fs')
const path = require('path')

const htmlDir = 'shareDailySign'
const viewport = {
  width: 1024,
  height: 1600,
}
let browser = null

const getFileName = (filePath) => {
	const files = fs.readdirSync(filePath)
  return files.filter(file => file.endsWith('.html'))
}

const picScreenshot = () => {
	const htmls = getFileName(path.resolve(__dirname, htmlDir))
  return htmls.map(async (html) => {
    const page = await browser.newPage()
    await page.setViewport(viewport)
    await page.goto(path.resolve(__dirname, htmlDir, html))
    // 获取pic元素
    const pic = await page.$('#pic')
    await pic.screenshot({
      path: path.resolve(__dirname, 'imgs', `${html.slice(0, -5)}.png`),
    })
    await page.close()
  })
}

const start = async () => {
	browser = await puppeteer.launch({headless: true})
	await Promise.all(picScreenshot())
	await browser.close()
	console.timeEnd('html2img')
}

start()
// 1562ms
