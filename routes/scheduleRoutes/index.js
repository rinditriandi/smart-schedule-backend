const router = require('express').Router()
const { checkAvailability, readScheduleById, readSchedules, createSchedule, deleteSchedule, cancelSchedule, updateSchedule, syncScheduleWithGcal, unsyncScheduleWithGcal } = require('../../controller/scheduleController')
const { authentication } = require('../../middlewares')

router.get('/:id', authentication, readScheduleById)
router.get('/', authentication, readSchedules)
router.post('/', authentication, createSchedule)
router.post('/cancel/:id', authentication, cancelSchedule)
router.post('/checkAvailability', authentication, checkAvailability)
router.post('/syncWithGcal/:id', authentication, syncScheduleWithGcal)
router.post('/unsyncWithGcal/:id', authentication, unsyncScheduleWithGcal)
router.put('/:id', authentication, updateSchedule)
router.delete('/:id', authentication, deleteSchedule)

module.exports = router