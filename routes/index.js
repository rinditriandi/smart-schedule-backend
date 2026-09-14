const router = require('express').Router()
const healthCheckRoutes = require('./healthCheckRoutes')
const scheduleRoutes = require('./scheduleRoutes')
const plotRoutes = require('./plotRoutes')
const requirementRoutes = require('./requirementRoutes')
const activityTypeRoutes = require('./activityTypeRoutes')
const classTypeRoutes = require('./classTypeRoutes')
const consultantRoutes = require('./consultantRoutes')
const consultantTypeRoutes = require('./consultantTypeRoutes')
const reportRoutes = require('./reportRoutes')
const clientRoutes = require('./clientRoutes')
const topicRoutes = require('./topicRoutes')
const opportunityRoutes = require('./opportunityRoutes')
const gcalRoutes = require('./gcalRoutes')
const userRoutes = require('./userRoutes')
const timeoffRoutes = require('./timeoffRoutes')
const cronJobRoutes = require('./cronJobRoutes')
const programScheduleRoutes = require('./programScheduleRoutes')

router.use('/healthCheck', healthCheckRoutes)
router.use('/schedules', scheduleRoutes)
router.use('/plots', plotRoutes)
router.use('/requirements', requirementRoutes)
router.use('/consultants', consultantRoutes)
router.use('/consultantTypes', consultantTypeRoutes)
router.use('/activityTypes', activityTypeRoutes)
router.use('/classTypes', classTypeRoutes)
router.use('/reports', reportRoutes)
router.use('/clients', clientRoutes)
router.use('/topics', topicRoutes)
router.use('/opportunities', opportunityRoutes)
router.use('/googleCalendars', gcalRoutes)
router.use('/users', userRoutes)
router.use('/timeoff', timeoffRoutes)
router.use('/programSchedules', programScheduleRoutes)
router.use('/cronJobs', cronJobRoutes)

router.post('/dateToTime', (req, res, next) => {
  try {
    const { date, month, year, hours, minutes } = req.body

    const date_ = Number(date) < 10 ? `0${date}` : `${date}`
    const month_ = Number(month) < 10 ? `0${month}` : `${month}`
    let fullDate = new Date(`${year}-${month_}-${date_}`)
    fullDate.setHours(Number(hours), Number(minutes), 0, 0)
    console.log(fullDate)

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: fullDate.getTime()
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router