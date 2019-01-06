const express = require('express')
const controller = require('./controller')

const router = express.Router()

router.post('./addJoke', controller.addJoke)

router.get('./findJokeList', controller.findJokeList)

module.exports = router
