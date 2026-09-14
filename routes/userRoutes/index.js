const router = require('express').Router()
const { readUsers } = require('../../controller/userController')
const { authentication } = require('../../middlewares')

router.get('/', authentication, readUsers)

module.exports = router