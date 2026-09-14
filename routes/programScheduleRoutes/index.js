const router = require('express').Router()
const { readProgramSchedules, readProgramScheduleById } = require('../../controller/programScheduleController')
const { authentication } = require('../../middlewares')

router.get('/:id', authentication, readProgramScheduleById)

router.get('/', authentication, readProgramSchedules)

module.exports = router