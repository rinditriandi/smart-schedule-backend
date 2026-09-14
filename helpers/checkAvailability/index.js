const { Schedule, ConsultantSchedule, Plot } = require('../../models')
const { Op } = require('sequelize')

const checkAvailability = ({ ConsultantId, startHours, endHours, ScheduleId = null }) => {
  return new Promise(async (resolve, reject) => {
    try {

      // Find Consultant Schedule
      const consultantSchedules = await ConsultantSchedule.findAll({
        where: {
          ConsultantId,
          ScheduleId: {
            [Op.ne]: ScheduleId
          }
        },
        include: [
          {
            model: Schedule,
            include: [
              {
                model: Plot
              }
            ],
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    {
                      startHours: {
                        [Op.lte]: startHours
                      }
                    },
                    {
                      endHours: {
                        [Op.gte]: startHours
                      }
                    },
                  ]
                },
                {
                  [Op.and]: [
                    {
                      startHours: {
                        [Op.lte]: endHours
                      }
                    },
                    {
                      endHours: {
                        [Op.gte]: endHours
                      }
                    },
                  ]
                },
                {
                  [Op.and]: [
                    {
                      startHours: {
                        [Op.gte]: startHours
                      }
                    },
                    {
                      endHours: {
                        [Op.lte]: endHours
                      }
                    },
                  ]
                },
              ]
            }
          }
        ]
      })

      // // Check same schedule
      // const sameSchedules = []
      // consultantSchedules.forEach(cSchecule => {
      //   let hasPush = false
      //   if (Number(startHours) >= Number(cSchecule?.Schedule?.startHours) && Number(startHours) <= Number(cSchecule?.Schedule?.endHours)) {
      //     sameSchedules.push(cSchecule)
      //     hasPush = true
      //   }
      //   if (Number(startHours) < Number(cSchecule?.Schedule?.startHours) && Number(endHours) > Number(cSchecule?.Schedule?.endHours) && !hasPush) {
      //     sameSchedules.push(cSchecule)
      //     hasPush = true
      //   }
      //   if (Number(endHours) >= Number(cSchecule?.Schedule?.startHours) && Number(endHours) <= Number(cSchecule?.Schedule?.endHours) && !hasPush) {
      //     sameSchedules.push(cSchecule)
      //   }
      // })

      resolve(consultantSchedules.filter(item => !item?.Schedule?.isDeleted && !item?.Schedule?.isCanceled))
    } catch (err) {
      console.log(err)
      reject({ code: '500', errors: ['failed check avilability'] })
    }
  })
}

module.exports = { checkAvailability }