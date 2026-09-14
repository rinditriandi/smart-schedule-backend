const router = require('express').Router()
const { readActivityTypes } = require('../../controller/activityTypeController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readActivityTypes)

module.exports = router