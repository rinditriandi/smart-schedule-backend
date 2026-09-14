const router = require('express').Router()
const { readClassTypes } = require('../../controller/classTypeController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readClassTypes)

module.exports = router