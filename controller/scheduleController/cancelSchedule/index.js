const { Schedule, ScheduleHistory, SameSchedule, Plot, PlotPermission } = require('../../../models')
const { deleteGcal } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { id } = req.params
    const { sendEmailGcal } = req.body

    // Find schedule
    const findSchedule = await Schedule.findByPk(id, {
      include: [
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

    // Check plot permission
    // let hasAccess = false
    // findSchedule?.Plot?.PlotPermissions?.forEach(permission => {
    //   if (permission?.email == req?.user?.email) {
    //     hasAccess = true
    //   }
    // })
    // if (!hasAccess) throw { code: '403', errors: ['you have no access on this plot'] }

    // Cancel schedule
    await Schedule.update(
      {
        isCanceled: 1,
        gcalEventId: null,
        gcalEventStatus: null
      },
      {
        where: {
          id: findSchedule.id
        }
      }
    )

    // Insert schedule history
    ScheduleHistory.create({
      ScheduleId: findSchedule.id,
      type: 'canceled',
      createdBy: req.user.id,
      createdAt: now,
      updatedAt: now
    })

    // Delete google calendar event
    if (findSchedule?.gcalEventId) {
      deleteGcal({
        eventId: findSchedule.gcalEventId,
        sendUpdates: sendEmailGcal ? 'all' : null
      })
    }

    // delete same schedules
    await SameSchedule.destroy({
      where: {
        [Op.or]: [
          {
            Schedule1: findSchedule.id
          },
          {
            Schedule2: findSchedule.id
          },
        ]
      }
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findSchedule
    })
  } catch (err) {
    next(err)
  }
}