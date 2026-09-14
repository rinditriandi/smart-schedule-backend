const { Plot, PlotPermission, Schedule, ScheduleHistory } = require('../../../models')
const { Op } = require('sequelize')
const { deleteGcal } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const now = new Date().getTime()

    const findPlot = await Plot.findByPk(id, {
      include: [
        {
          model: Schedule
        },
        {
          model: PlotPermission
        },
      ]
    })

    if (!findPlot || findPlot?.isDeleted) throw { code: '404', errors: ['plot not found'] }

    // Check plot permission
    let hasAccess = false
    findPlot?.PlotPermissions?.forEach(permission => {
      if (permission?.UserId == req.user.id) {
        hasAccess = true
      }
    })
    if (!hasAccess) throw { code: '403', errors: ['you have no access on this plot'] }

    if (findPlot?.isCanceled) throw { code: '400', errors: ['plot has been canceled'] }

    // Schedule history bulk create
    const scheduleHistoryBulkCreate = []
    findPlot?.Schedules?.forEach(schedule => {
      if (!schedule?.isCanceled) {
        scheduleHistoryBulkCreate.push({
          ScheduleId: schedule?.id,
          type: 'canceled',
          createdBy: req.user.id,
          createdAt: now,
          updatedAt: now
        })
      }
    })

    // Update schedules
    Schedule.update(
      {
        isCanceled: 1,
        gcalEventId: null,
        gcalEventStatus: null
      },
      {
        where: {
          id: {
            [Op.or]: findPlot?.Schedules?.map(schedule => schedule.id)
          },
          isCanceled: {
            [Op.or]: [0, null]
          }
        }
      }
    )

    // Update plot
    await Plot.update(
      {
        isCanceled: 1
      },
      {
        where: {
          id: findPlot.id
        }
      }
    )

    // Create schedule histories
    if (scheduleHistoryBulkCreate.length > 0) {
      ScheduleHistory.bulkCreate(scheduleHistoryBulkCreate)
    }

    // Delete gcal
    const deleteGcalPromises = []
    findPlot?.Schedules?.forEach(schedule => {
      if (schedule?.gcalEventId) {
        deleteGcalPromises.push(deleteGcal({
          eventId: schedule.gcalEventId
        }))
      }
    })
    if (deleteGcalPromises.length > 0) {
      Promise.all(deleteGcalPromises)
    }

    const findUpdatedPlot = await Plot.findByPk(findPlot.id)


    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findUpdatedPlot
    })
  } catch (err) {
    next(err)
  }
}