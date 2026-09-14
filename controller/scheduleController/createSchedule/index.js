const { Schedule, Plot, ScheduleAttendee, ScheduleHistory, ConsultantSchedule, Consultant } = require('../../../models')
const { createGcal, insertConsultantSameSchedules } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  let ScheduleId
  try {
    const now = new Date().getTime()
    const { PlotId, gcalSync, consultants, ActivityTypeId, startHours, endHours, ClassTypeId, location, description, attendees, breakDuration, sendEmailGcal, gcalSummary, opportunityId } = req.body
    let date = new Date(startHours)
    date.setHours(0, 0, 1, 0)
    if (!PlotId) throw { code: '404', errors: ['plot not found'] }

    // Find plot
    const findPlot = await Plot.findByPk(PlotId)
    if (!findPlot) throw { code: '404', errors: ['plot not found'] }

    // find consultants
    const findConsultants = await Consultant.findAll({
      where: {
        id: {
          [Op.or]: consultants.map(item => item.ConsultantId)
        }
      }
    })
    if (findConsultants.length !== consultants.length) throw { code: '404', errors: ['consultant not found'] }

    // Insert schedule
    const newSchedule = await Schedule.create({
      PlotId: findPlot.id,
      ActivityTypeId,
      ClassTypeId,
      date: new Date(date).getTime(),
      startHours,
      gcalSummary,
      endHours,
      location,
      description,
      breakDuration,
      createdAt: now,
      updatedAt: now
    })
    ScheduleId = newSchedule.id

    // Insert Attendees
    const attendeesPlusConsultants = []

    findConsultants.forEach(item => {
      attendeesPlusConsultants.push({
        ScheduleId: newSchedule.id,
        email: item?.email,
        name: item?.name || null,
        createdAt: now,
        updatedAt: now
      })
    })

    if (Array.isArray(attendees)) {
      attendees.forEach(item => {
        attendeesPlusConsultants.push({
          ScheduleId: newSchedule.id,
          email: item?.email,
          name: item?.name || null,
          createdAt: now,
          updatedAt: now
        })
      })
    }
    attendeesPlusConsultants.push({
      ScheduleId: newSchedule.id,
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

    await ScheduleAttendee.bulkCreate(attendeesFilter)

    // Insert Consultant Schedule
    await ConsultantSchedule.bulkCreate(consultants.map(consultant => {
      return {
        ConsultantId: consultant?.ConsultantId,
        ConsultantTypeId: consultant?.ConsultantTypeId,
        ScheduleId: newSchedule?.id,
        createdAt: now,
        updatedAt: now
      }
    }))

    // Query new schedule
    const findNewSchedule = await Schedule.findByPk(newSchedule.id, {
      include: [
        {
          model: ScheduleAttendee
        },
        {
          model: ConsultantSchedule
        },
      ]
    })

    // Insert same schedule
    insertConsultantSameSchedules({
      consultants,
      schedule: newSchedule
    })


    // Insert schedule history
    ScheduleHistory.create({
      ScheduleId: newSchedule.id,
      type: 'created',
      createdBy: req.user.id,
      createdAt: now,
      updatedAt: now
    })

    // Create gcal
    if (gcalSync === true) {
      await createGcal({
        ScheduleId: findNewSchedule.id,
        start: new Date(findNewSchedule.startHours),
        end: new Date(findNewSchedule.endHours),
        summary: findNewSchedule?.gcalSummary || findPlot.topic,
        location: findNewSchedule?.location || null,
        description: findNewSchedule?.description || null,
        attendees: findNewSchedule?.ScheduleAttendees?.length > 0 ? findNewSchedule?.ScheduleAttendees?.map(attendee => {
          return {
            email: attendee?.email
          }
        }) : null,
        sendUpdates: sendEmailGcal ? 'all' : null
      })
    }

    res.status(201).json({
      code: '201',
      status: 'CREATED',
      data: findNewSchedule
    })
  } catch (err) {
    // Delete schedule
    if (ScheduleId) {
      await Schedule.destroy({
        where: {
          id: ScheduleId
        }
      })
    }

    next(err)
  }
}