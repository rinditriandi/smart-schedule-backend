const router = require('express').Router()
const { readTimeoffTypes, readTimeoff, createTimeoff, deleteTimeoff } = require('../../controller/timeoffController')
const { authentication } = require('../../middlewares')

router.get('/types', authentication, readTimeoffTypes)
router.get('/', authentication, readTimeoff)
router.post('/', authentication, createTimeoff)
router.delete('/:id', authentication, deleteTimeoff)

module.exports = router