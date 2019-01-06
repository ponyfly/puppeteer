const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')
const userAgents = require('../tools/userAgent')

const getProxyIp = async (page = 1) => {
	const userAgent = userAgents[Math.floor(Math.random() * (userAgents.length - 1))]
	const options = {
		url: `https://www.xicidaili.com/nn/${page}`,
		headers: {
			'User-Agent': userAgent,
		},
	}
	const storage = []
	const data = await axios(options)
	const $ = cheerio.load(data.data)
	const ipList = $('#ip_list tr').slice(1)
	ipList.each((i, ipListElement) => {
		const ip = $(ipListElement).find('td').eq(1).text()
		const port = $(ipListElement).find('td').eq(2).text()
		const type = $(ipListElement).find('td').eq(5).text().toLocaleLowerCase()
		if (type === 'http') {
			storage.push(`${type}://${ip}:${port}`)
		}
	})
	return storage
}

const validateIp = async (data) => {
	const validatedIp = []
	const validatePromise = data.map(async (ip) => {
	  const userAgent = userAgents[Math.floor(Math.random() * (userAgents.length - 1))]
		const options = {
	  	url: 'https://www.baidu.com',
			headers: {
				'User-Agent': userAgent,
			},
			proxy: ip,
		}
		try {
			const res = await axios(options)
			console.log(res)
			console.log(res.statusCode)
			if (res.statusCode === 200) {
				return ip
			}
		} catch (err) {
		}
	})
	const resu = await Promise.all(validatePromise)
	console.log(resu)
}
validateIp(['http://111.204.47.131:80'])

// getProxyIp()
