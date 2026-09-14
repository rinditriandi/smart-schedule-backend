const router = require('express').Router()
const { readConsultants } = require('../../controller/consultantController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readConsultants)

module.exports = router