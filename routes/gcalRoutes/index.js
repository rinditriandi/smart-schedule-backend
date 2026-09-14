const router = require('express').Router()
const { createGcal } = require('../../controller/gcalController')
const { authentication } = require('../../middlewares')

router.post('/', authentication, createGcal)

module.exports = router