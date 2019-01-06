const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/connect')
const jokeRouter = require('./modules/joke/router')
require('./modules/joke/model')

const app = express()
db.connect()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(jokeRouter)
app.set('port', 3000)

app.listen(app.get('port'), () => {
	console.log(`start listen at ${app.get('port')}`)
})
