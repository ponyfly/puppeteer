const mongoose = require('mongoose')

const uri = 'mongodb:127.0.0.1/joke'
const option = {
	useNewUrlParser: true,
	reconnectTries: 30,
	reconnectInterval: 500,
}

const connect = () => {
	mongoose.connect(uri, option)
		.then(() => {
			console.log('连接数据库成功~')
		})
		.catch((err) => {
			console.log(err)
		})
}

module.exports = {
	connect,
}
