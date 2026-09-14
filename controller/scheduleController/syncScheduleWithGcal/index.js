const { Schedule, ScheduleAttendee, ScheduleHistory, Plot, PlotPermission } = require('../../../models')
const { createGcal } = require('../../../helpers')

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
    if (findSchedule?.isCanceled) throw { code: '404', errors: ['schedule has been canceled'] }
    if (findSchedule?.Plot?.isDeleted) throw { code: '400', errors: ['plot has been deleted'] }
    if (findSchedule?.Plot?.isCanceled) throw { code: '400', errors: ['plot has been canceled'] }
    if (findSchedule?.gcalEventId) throw { code: '400', errors: ['google calendar event already exist'] }

    // Check plot permission
    // let hasAccess = false
    // findSchedule?.Plot?.PlotPermissions?.forEach(permission => {
    //   if (permission?.email == req?.user?.email) {
    //     hasAccess = true
    //   }
    // })
    // if (!hasAccess) throw { code: '403', errors: ['you have no access on this plot'] }

    // Create google calendar
    createGcal({
      user: req.user,
      ScheduleId: findSchedule.id,
      start: new Date(findSchedule.startHours),
      end: new Date(findSchedule.endHours),
      summary: findSchedule?.gcalSummary || findSchedule?.Plot?.topic,
      location: findSchedule.location,
      description: findSchedule.description,
      attendees: findSchedule?.ScheduleAttendees?.length > 0 ? findSchedule?.ScheduleAttendees?.map(attendee => {
        return {
          email: attendee?.email
        }
      }) : null,
      createScheduleHistory: true,
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