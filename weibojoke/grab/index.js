const grab = require('./grab');

(async () => {
	const baseUrl = 'https://s.weibo.com/video?q=%E6%90%9E%E7%AC%91%E8%A7%86%E9%A2%91&xsort=hot&hasvideo=1&tw=video&Refer=weibo_video'
	const grabPage = 3
  const jokes = await grab.start(baseUrl, grabPage)
	console.log(jokes)
})()
