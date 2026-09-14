const { Schedule, ScheduleHistory, ScheduleAttendee, Plot, PlotPermission, ScheduleHistoryBefore, ScheduleHistoryAfter, SameSchedule, ConsultantSchedule, Consultant } = require('../../../models')
const { updateGcal, insertConsultantSameSchedules } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { id } = req.params
    const { PlotId, ActivityTypeId, startHours, endHours, ClassTypeId, location, description, attendees, sendEmailGcal, consultants = null, breakDuration = null, gcalSummary } = req.body

    // Validation Plot ID
    let findPlot = null
    if (PlotId) {
      findPlot = await Plot.findByPk(PlotId, {
        include: [
          {
            model: PlotPermission
          }
        ]
      })
      if (!findPlot) throw { code: '404', errors: ['wbs not found'] }

      // Check plot permission
      // let hasAccess = false
      // findPlot?.PlotPermissions?.forEach(permission => {
      //   if (permission?.email == req?.user?.email) {
      //     hasAccess = true
      //   }
      // })
      // if (!hasAccess) throw { code: '403', errors: ['you have no access on this wbs'] }

    }

    if (consultants && !Array.isArray(consultants)) throw { code: '400', errors: ['consultants must be an array or null'] }

    // find consultants
    const findConsultants = await Consultant.findAll({
      where: {
        id: {
          [Op.or]: consultants.map(item => item.ConsultantId)
        }
      }
    })
    if (findConsultants.length !== consultants.length) throw { code: '404', errors: ['consultant not found'] }

    let isValidConsultants = true
    consultants.forEach(item => {
      if (!item?.ConsultantId || !item?.ConsultantTypeId) {
        isValidConsultants = false
      }
    })
    if (!isValidConsultants) throw { code: '400', errors: ['Invalid format consultants'] }

    let date = new Date(startHours)
    date.setHours(0, 0, 1, 0)

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
    if (findSchedule?.isCanceled) throw { code: '400', errors: ['schedule has been canceled'] }
    if (findSchedule?.Plot?.isDeleted) throw { code: '400', errors: ['plot has been deleted'] }
    if (findSchedule?.Plot?.isCanceled) throw { code: '400', errors: ['plot has been canceled'] }

    // Check plot permission
    // let hasAccess = false
    // findSchedule?.Plot?.PlotPermissions?.forEach(permission => {
    //   if (permission?.email == req?.user?.email) {
    //     hasAccess = true
    //   }
    // })
    // if (!hasAccess) throw { code: '403', errors: ['you have no access on this wbs'] }

    const attendeesPlusConsultants = []

    findConsultants.forEach(item => {
      attendeesPlusConsultants.push({
        ScheduleId: findSchedule.id,
        email: item?.email,
        name: item?.name || null,
        createdAt: now,
        updatedAt: now
      })
    })

    if (Array.isArray(attendees)) {
      attendees.forEach(item => {
        attendeesPlusConsultants.push({
          ScheduleId: findSchedule.id,
          email: item?.email,
          name: item?.name || null,
          createdAt: now,
          updatedAt: now
        })
      })
    }
    attendeesPlusConsultants.push({
      ScheduleId: findSchedule.id,
      email: req?.user?.email,
      name: req?.user?.fullname || req?.user?.email,
      createdAt: now,
      updatedAt: now
    })

    const attendeesFilter = []
    attendeesPlusConsultants.forEach(item => {
      let isDuplicate = false

      attendeesFilter.forEach(itemFilter => {
        if (item.email == itemFilter.email) {
          isDuplicate = true
        }
      })

      if (!isDuplicate) {
        attendeesFilter.push(item)
      }
    })

    if (findSchedule?.gcalEventId) {
      await updateGcal({
        start: new Date(startHours),
        end: new Date(endHours),
        summary: gcalSummary || findSchedule?.Plot?.topic,
        location,
        description,
        attendees: attendeesFilter?.length > 0 ? attendeesFilter?.map(attendee => {
          return {
            email: attendee?.email
          }
        }) : null,
        schedule: findSchedule,
        sendUpdates: sendEmailGcal === true ? 'all' : 'none'
      })
    }

    // Update schedule
    await Schedule.update(
      {
        PlotId: PlotId ? findPlot.id : findSchedule.PlotId,
        ActivityTypeId,
        date: date.getTime(),
        startHours,
        endHours,
        gcalSummary,
        ClassTypeId,
        location,
        description,
        breakDuration
      },
      {
        where: {
          id: findSchedule.id
        }
      }
    )

    // Delete old attendees
    ScheduleAttendee.destroy({
      where: {
        ScheduleId: findSchedule.id
      }
    })

    // Insert new attendees
    if (attendees && Array.isArray(attendees)) {
      ScheduleAttendee.bulkCreate(attendeesFilter)
    }

    // Delete Old Consultant Schedule
    await ConsultantSchedule.destroy({
      where: {
        ScheduleId: findSchedule.id
      }
    })

    // Create new consultant schedule
    await ConsultantSchedule.bulkCreate(consultants.map(consultant => {
      return {
        ConsultantId: consultant?.ConsultantId,
        ConsultantTypeId: consultant?.ConsultantTypeId,
        ScheduleId: findSchedule?.id,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }
    }))

    // Query updated schedule
    const updatedSchedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Plot
        },
        {
          model: ScheduleAttendee
        },
        {
          model: SameSchedule
        },
        {
          model: ConsultantSchedule
        },
      ]
    })

    // delete old same schedules
    await SameSchedule.destroy({
      where: {
        [Op.or]: [
          {
            Schedule1: updatedSchedule.id
          },
          {
            Schedule2: updatedSchedule.id
          },
        ]
      }
    })

    // Insert new same schedules
    insertConsultantSameSchedules({
      consultants: updatedSchedule?.dataValues?.ConsultantSchedules,
      schedule: updatedSchedule
    })

    // Insert schedule history
    const newScheduleHistory = await ScheduleHistory.create({
      ScheduleId: findSchedule.id,
      type: 'update',
      createdBy: req.user.id,
      createdAt: now,
      updatedAt: now
    })

    // Insert schedule history before
    ScheduleHistoryBefore.create({
      ScheduleHistoryId: newScheduleHistory.id,
      ActivityTypeId: findSchedule?.ActivityTypeId,
      date: findSchedule?.date,
      startHours: findSchedule?.startHours,
      endHours: findSchedule?.endHours,
      ClassTypeId: findSchedule?.ClassTypeId,
      location: findSchedule?.location,
      description: findSchedule?.description,
      createdAt: now,
      updatedAt: now
    })

    // Insert schedule history after
    ScheduleHistoryAfter.create({
      ScheduleHistoryId: newScheduleHistory.id,
      ActivityTypeId: ActivityTypeId,
      date: new Date(date).getTime(),
      startHours: startHours,
      endHours: endHours,
      ClassTypeId: ClassTypeId,
      location: location,
      description: description,
      createdAt: now,
      updatedAt: now
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: updatedSchedule
    })
  } catch (err) {
    next(err)
  }
}