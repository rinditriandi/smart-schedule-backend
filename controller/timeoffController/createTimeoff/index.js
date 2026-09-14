const { Schedule, Plot, ScheduleAttendee, ScheduleHistory, ConsultantSchedule, Consultant, ActivityType } = require('../../../models')
const { createGcal, insertConsultantSameSchedules } = require('../../../helpers')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { ConsultantId, ActivityTypeId, startHours, endHours, requestType, halfdayType, description } = req.body

    // Find consultant
    const findConsultant = await Consultant.findByPk(ConsultantId)
    if (!findConsultant) throw { code: '404', errors: ['consultant not found'] }
    // Find timeoff plot
    const findPlot = await Plot.findOne({
      where: {
        name: 'timeoff',
        group: 'PNC'
      }
    })
    if (!findPlot) throw { code: '404', errors: ['plot not found'] }

    // Find activity type
    const findActivityType = await ActivityType.findByPk(ActivityTypeId)
    if (!findActivityType) throw { code: '404', errors: ['activity type not found'] }

    // Date condition
    let requestType_ = requestType
    let startHours_ = new Date(Number(startHours))
    let endHours_ = new Date(Number(endHours))

    if (findActivityType.apiName === 'cutitahunan' || findActivityType.apiName === 'cutibesar') {
      startHours_.setHours(0, 0, 0, 0)
      endHours_.setHours(23, 59, 0, 0)
      requestType_ = 'fullday'
    } else if (requestType === 'fullday') {
      startHours_.setHours(0, 0, 0, 0)
      endHours_.setHours(23, 59, 0, 0)
    } else if (requestType === 'halfday' && halfdayType === 'beforeBreak') {
      startHours_.setHours(0, 0, 0, 0)
      endHours_.setHours(12, 0, 0, 0)
    } else if (requestType === 'halfday' && halfdayType === 'afterBreak') {
      startHours_.setHours(12, 0, 0, 0)
      endHours_.setHours(23, 59, 0, 0)
    } else {
      throw { code: '400', errors: ['invalid date condition'] }
    }

    // Insert schedule
    const newSchedule = await Schedule.create({
      PlotId: findPlot.id,
      ActivityTypeId: findActivityType.id,
      ClassTypeId: 3,
      date: new Date(startHours_).getTime(),
      startHours: startHours_.getTime(),
      endHours: endHours_.getTime(),
      gcalSummary: 'timeoff',
      location: null,
      description,
      breakDuration: 0,
      createdAt: now,
      updatedAt: now
    })

    // Insert attendees
    await ScheduleAttendee.create({
      ScheduleId: newSchedule.id,
      email: findConsultant.email,
      name: findConsultant.name,
      createdAt: now,
      updatedAt: now
    })

    // Insert Consultant Schedule
    await ConsultantSchedule.create({
      ConsultantId: findConsultant.id,
      ConsultantTypeId: 9,
      ScheduleId: newSchedule?.id,
      createdAt: now,
      updatedAt: now
    })

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
      consultants: [{ ConsultantId: findConsultant.id, ConsultantTypeId: 9 }],
      schedule: findNewSchedule
    })

    res.status(201).json({
      code: '201',
      status: 'CREATED'
    })
  } catch (err) {
    next(err)
  }
}