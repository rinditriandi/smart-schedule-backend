const router = require('express').Router()
const { apmReminder } = require('../../controller/cronJobController')

router.post('/apmReminders/@Pmeli2021!', apmReminder)

module.exports = router