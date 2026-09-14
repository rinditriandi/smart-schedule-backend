const router = require('express').Router()
const { readClients } = require('../../controller/clientController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readClients)

module.exports = router