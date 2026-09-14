const { Schedule, SameSchedule, ActivityType, Consultant, ScheduleAttendee, ScheduleHistory, ScheduleHistoryBefore, ScheduleHistoryAfter, Plot, ClassType, Requirement, RequirementCategory } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params

    const findSchedule = await Schedule.findByPk(id, {
      include: [
        {
          model: Plot
        },
        {
          model: Consultant,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: ClassType
        },
        {
          model: ScheduleAttendee,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: ActivityType,
          attributes: ['id', 'label', 'apiName']
        },
        {
          model: SameSchedule,
          include: [
            {
              model: Schedule,
              as: 'Schedule',
              include: [
                {
                  model: Plot
                }
              ]
            }
          ]
        },
        {
          model: Requirement
        },
        {
          model: ScheduleHistory,
          include: [
            {
              model: ScheduleHistoryBefore
            },
            {
              model: ScheduleHistoryAfter
            },
          ]
        }
      ]
    })
    if (!findSchedule || findSchedule?.isDeleted) throw { code: '404', errors: ['schedule not found'] }

    // Query requirement category
    const requirementCategories = await RequirementCategory.findAll({
      attributes: ['apiName', 'label'],
      include: [
        {
          model: Requirement
        }
      ]
    })
    requirementCategories.forEach(rc => {
      rc.dataValues.items = [...rc.dataValues.Requirements]
      rc.dataValues.Requirements = undefined
    })

    const scheduleRequirements = [...findSchedule?.dataValues?.Requirements]

    requirementCategories.forEach(rc => {
      rc.dataValues.items.forEach(r => {
        r.dataValues.isReady = false
        r.dataValues.isNeed = false
        r.dataValues.note = null
        scheduleRequirements.forEach(sr => {
          if (sr.id == r.dataValues.id) {
            r.dataValues.isNeed = true
            r.dataValues.note = sr?.ScheduleRequirement?.note || null
            if (sr?.ScheduleRequirement?.isReady) {
              r.dataValues.isReady = true
            }
          }
        })
      })
    })

    findSchedule.dataValues.Requirements = [...requirementCategories]

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findSchedule
    })
  } catch (err) {
    next(err)
  }
}