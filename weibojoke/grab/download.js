const request = require('request')
const fs = require('fs')
const path = require('path')

request
	.get('https://f.us.sinaimg.cn/002h50F2lx07qgGf6idq01040200u4iD0E010.mp4?label=mp4_ld&template=360x636.24.0&Expires=1545973329&ssig=1YNRkIqLKC&KID=unistore,video')
	.pipe(fs.createWriteStream(path.resolve(__dirname, './02.mp4')))
	.on('close', () => console.log('end'))
