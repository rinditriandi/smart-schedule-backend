const router = require('express').Router()
const { readTopics } = require('../../controller/topicController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readTopics)

module.exports = router