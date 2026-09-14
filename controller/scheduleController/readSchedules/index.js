const { Schedule, Plot, PlotSapProjectId, Consultant, PlotPermission, SameSchedule, ScheduleRequirement, ClassType, ActivityType } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { ConsultantId, dateFrom, dateTo, ClassTypeId, ActivityTypeId, calendarView, group } = req.query
    if (!dateFrom || !dateTo) throw { code: '400', errors: ['date from and date to is required'] }

    // Filter consultant
    const includeConsultant = []
    if (ConsultantId) {
      includeConsultant.push({
        model: Consultant,
        where: {
          id: ConsultantId
        }
      })
    } else {
      includeConsultant.push({
        model: Consultant
      })
    }

    // Filter between date
    let filterDate = undefined
    if (dateFrom && dateTo) {
      filterDate = {
        [Op.or]: [
          {
            [Op.and]: [
              {
                startHours: {
                  [Op.gte]: dateFrom
                }
              },
              {
                startHours: {
                  [Op.lte]: dateTo
                }
              }
            ]
          },
          {
            [Op.and]: [
              {
                endHours: {
                  [Op.gte]: dateFrom
                }
              },
              {
                endHours: {
                  [Op.lte]: dateTo
                }
              }
            ]
          },
        ]
      }
    }

    // Filter Class Type
    let filterClassType = undefined
    if (ClassTypeId) {
      filterClassType = {
        ClassTypeId
      }
    }

    // Filter Activity Type
    let filterActivityType = undefined
    if (ActivityTypeId) {
      filterActivityType = {
        ActivityTypeId
      }
    }

    // Filter Group
    let filterGroup = undefined
    if (group) {
      if (group == 'APM P' || group == 'BPE-P' || group == 'BPE P') {
        filterGroup = {
          group: {
            [Op.or]: ['APM P', 'BPE-P', 'BPE P']
          }
        }
      } else if (group == 'APM C1' || group == 'BPE-C1' || group == 'BPE C1') {
        filterGroup = {
          group: {
            [Op.or]: ['APM C1', 'BPE-C1', 'BPE C1']
          }
        }
      } else if (group == 'APM C2' || group == 'BPE-C2' || group == 'BPE C2') {
        filterGroup = {
          group: {
            [Op.or]: ['APM C2', 'BPE-C2', 'BPE C2']
          }
        }
      } else if (group == 'APM C3' || group == 'BPE-C3' || group == 'BPE C3') {
        filterGroup = {
          group: {
            [Op.or]: ['APM C3', 'BPE-C3', 'BPE C3']
          }
        }
      } else {
        filterGroup = {
          group
        }
      }
    }

    let data

    if (calendarView == 'true') {
      data = await Schedule.findAll({
        where: {
          ...filterDate,
          ...filterClassType,
          ...filterActivityType,
          isDeleted: {
            [Op.or]: [null, 0]
          },
        },
        order: [['startHours', 'ASC']],
        include: [
          {
            model: Plot,
            where: {
              ...filterGroup,
            },
            include: [
              {
                model: PlotSapProjectId
              }
            ]
          },
          {
            model: ActivityType
          },
          {
            model: ClassType
          },
          ...includeConsultant,
          {
            model: SameSchedule,
            attributes: ['id']
          },
          {
            model: ScheduleRequirement,
            attributes: ['isReady'],
            required: false,
            where: {
              isReady: {
                [Op.or]: [null, 0]
              }
            }
          }
        ]
      })

      data.forEach(schedule => {
        schedule.dataValues.notReadyRequirementCount = schedule.dataValues.ScheduleRequirements.length
        schedule.dataValues.ScheduleRequirements = undefined
      })
    } else {
      data = await Plot.findAll({
        where: {
          ...filterGroup
        },
        order: [[Schedule, 'startHours', 'ASC']],
        include: [
          {
            model: PlotSapProjectId
          },
          {
            model: PlotPermission,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
          },
          {
            model: Schedule,
            where: {
              ...filterDate,
              ...filterClassType,
              ...filterActivityType,
              isDeleted: {
                [Op.or]: [null, 0]
              }
            },
            include: [
              ...includeConsultant,
              {
                model: SameSchedule,
                attributes: ['id']
              },
              {
                model: ClassType
              },
              {
                model: ActivityType
              },
            ]
          }
        ]
      })
    }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data
    })
  } catch (err) {
    next(err)
  }
}