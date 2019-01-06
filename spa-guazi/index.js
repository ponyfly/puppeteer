const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const { USERAGENT } = require('../tools/userAgent')

const start = async (url) => {
  const browser = await puppeteer.launch()
  const viewport = {
    width: 1800,
    height: 1080,
  }
  const userAgent = USERAGENT[Math.floor(Math.random() * (USERAGENT.length - 1))]
  const page = await browser.newPage()
  await page.setUserAgent(userAgent)
  await page.setViewport(viewport)
  await page.goto(url)
  await page.waitForNavigation({
    waitUntil: 'load',
  })
  const title = await page.title()
  console.log(title)

  // 获取骑车品牌
  await page.waitForSelector('body > div.list-wrap.js-post > div.screen > dl:nth-child(1) > dd > div.dd-top')
  await page.click('.dd-top > .dd-btn.js-disAll.js-option-hid')
  const result = await page.$eval('div.dd-all.clearfix.js-brand.js-option-hid-info', (element) => {
    const aEles = Array.from(element.querySelectorAll('a'))
    return aEles.map(ele => ele.innerText)
  })
  // console.log(result)
  const writeStream = fs.createWriteStream(path.resolve(__dirname, './car_brands.json'))
  writeStream.write(JSON.stringify(result, undefined, 2), 'utf-8')
  writeStream.end()

  // 获取车源列表
  await page.waitForSelector('.carlist.clearfix.js-top')
  const carlist = await page.$$eval('.carlist.clearfix.js-top > li', (elements) => {
    elements = Array.from(elements)
    return elements.map((ele) => {
      const title = ele.querySelector('h2.t')
      const info = ele.querySelector('.t-i').innerText.split('|')
      return {
        title: title.innerText,
        year: info[0].trim(),
        milemeter: info[1].trim(),
      }
    })
  })
  // console.log(carlist)
  const writeStream2 = fs.createWriteStream(path.resolve(__dirname, './car_info_list.json'))
  writeStream2.write(JSON.stringify(carlist, undefined, 2), 'utf-8')
  writeStream2.end()
  browser.close()
}

start('https://www.guazi.com/hz/buy/')
