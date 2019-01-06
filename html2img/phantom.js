const phantom = require('phantom')
const path = require('path');

(async () => {
	console.time('grab')
	const instance = await phantom.create();
	const page = await instance.createPage();

	await page.open('https://www.baidu.com');
	await page.render(path.resolve(__dirname, './imgs/phantom_google.jpg'))
	await instance.exit();
	console.timeEnd('grab')
})()
// 2465 2415 2377 2521 2575 2397 2515 2374 2361 2515
// average 2447
