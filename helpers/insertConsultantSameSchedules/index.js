const { SameSchedule } = require('../../models')
const { checkAvailability } = require('../checkAvailability')
const { Op } = require('sequelize')

const insertConsultantSameSchedules = ({ consultants, schedule }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const now = new Date().getTime()
      const checkAvailabilities = []
      consultants.forEach(consultant => {
        checkAvailabilities.push(checkAvailability({
          ConsultantId: consultant?.ConsultantId,
          ScheduleId: schedule?.id,
          startHours: schedule?.startHours,
          endHours: schedule?.endHours,
        }))
      })
      const sameSchedules = await Promise.all(checkAvailabilities)
      const sameSchedulesBulkCreate = []
      sameSchedules.forEach(cSchedule => {
        cSchedule.forEach(schedule_c => {
          sameSchedulesBulkCreate.push({
            ConsultantId: schedule_c?.ConsultantId,
            Schedule1: schedule.id,
            Schedule2: schedule_c.ScheduleId,
            createdAt: now,
            updatedAt: now
          })
        })
      })

      const findSameSchedules = await SameSchedule.findAll({
        where: {
          ConsultantId: {
            [Op.or]: sameSchedulesBulkCreate.map(bk => bk.ConsultantId)
          }
        }
      })

      const sameScheduleBulkCreateFilter = []
      sameSchedulesBulkCreate.forEach(bk => {
        let isDuplicate = false
        findSameSchedules.forEach(findItem => {
          if ((findItem.dataValues.ConsultantId == bk.ConsultantId) && (bk.Schedule1 == findItem?.dataValues?.Schedule1 || bk.Schedule1 == findItem?.dataValues?.Schedule2) && (bk.Schedule2 == findItem?.dataValues?.Schedule1 || bk.Schedule2 == findItem?.dataValues?.Schedule2)) {
            isDuplicate = true
          }
        })

        if (!isDuplicate) {
          sameScheduleBulkCreateFilter.push(bk)
          sameScheduleBulkCreateFilter.push({
            ConsultantId: bk.ConsultantId,
            Schedule1: bk.Schedule2,
            Schedule2: bk.Schedule1,
            createdAt: bk.createdAt,
            updatedAt: bk.updatedAt,
          })
        }
      })
      if (sameScheduleBulkCreateFilter.length > 0) {
        SameSchedule.bulkCreate(sameScheduleBulkCreateFilter)
      }
    } catch (err) {
      console.log(err)
      reject('failed insert consultant same schedules')
    }
  })
}

module.exports = { insertConsultantSameSchedules }