const { Schedule, ScheduleAttendee, Plot, PlotPermission } = require('../../../models')
const { deleteGcal } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const { sendEmailGcal } = req.body

    // Find schedule
    const findSchedule = await Schedule.findByPk(id, {
      include: [
        {
          model: ScheduleAttendee
        },
        {
          model: Plot,
          include: [
            {
              model: PlotPermission
            }
          ]
        }
      ]
    })
    if (!findSchedule || findSchedule?.isDeleted) throw { code: '404', errors: ['schedule not found'] }
    if (!findSchedule?.gcalEventId) throw { code: '404', errors: ['google calendar event not found'] }

    // Check plot permission
    // let hasAccess = false
    // findSchedule?.Plot?.PlotPermissions?.forEach(permission => {
    //   if (permission?.email == req?.user?.email) {
    //     hasAccess = true
    //   }
    // })
    // if (!hasAccess) throw { code: '403', errors: ['you have no access on this plot'] }

    // Create google calendar
    deleteGcal({
      user: req.user,
      createScheduleHistory: true,
      schedule: findSchedule,
      updateSchedule: true,
      eventId: findSchedule.gcalEventId,
      sendUpdates: sendEmailGcal ? 'all' : null
    })

    res.status(200).json({
      code: '200',
      status: 'OK'
    })
  } catch (err) {
    next(err)
  }
}