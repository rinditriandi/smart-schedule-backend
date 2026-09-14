const router = require('express').Router()
const { readConsultantTypes } = require('../../controller/consultantTypeController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readConsultantTypes)

module.exports = router