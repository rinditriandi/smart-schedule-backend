const router = require('express').Router()
const healthCheckController = require('../../controller/healthCheckController')

router.get('/', healthCheckController)

module.exports = router