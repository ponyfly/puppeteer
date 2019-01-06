const mongoose = require('mongoose')

const { Schema } = mongoose

const JokeSchema = new Schema({
	title: {
		type: String,
		default: '这个太逗了！',
	},
	author: String,
	content: {
		type: String,
		required: [true, 'content不能为空'],
	},
})

mongoose.model('joke', JokeSchema)
