const mongoose = require('mongoose')

const JokeModel = mongoose.model('joke')

const addJoke = (req, res, next) => {
	const joke = new JokeModel(req.body)
	joke.save((err) => {
		if (err) {
			return res.status(400).send({
				errCode: -1,
				errMessage: '添加错误~',
			})
		}
		res.json({
			errCode: 0,
			errMessage: '添加成功~',
		})
	})
}

const findJokeList = (req, res, next) => {
	JokeModel.find({}, function (err, docs) {
		if (err) {
			return res.status(400).send({
				errCode: -1,
				errMessage: '添加错误~',
			})
		}
		res.json({
			errCode: 0,
			errMessage: '查找成功~',
			data: docs,
		})
	})
}

module.exports = {
	addJoke,
	findJokeList,
}
