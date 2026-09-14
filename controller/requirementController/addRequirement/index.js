const { Requirement, ScheduleRequirement, Schedule } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const { ScheduleId, RequirementId } = req.body
    if (!ScheduleId || !RequirementId) throw { code: '400', errors: ['schedule id and requirement id are required'] }

    // Find Schedule
    const findSchedule = await Schedule.findByPk(ScheduleId)
    if (!findSchedule) throw { code: '404', errors: ['schedule not found'] }

    // Find Requirement
    const findRequirement = await Requirement.findByPk(RequirementId)
    if (!findRequirement) throw { code: '404', errors: ['requirement not found'] }

    // Find Schedule Requirement
    const findScheduleRequirement = await ScheduleRequirement.findOne({
      where: {
        ScheduleId: findSchedule.id,
        RequirementId: findRequirement.id
      }
    })
    if (findScheduleRequirement) throw { code: '400', errors: ['requirement already exist'] }

    // Insert Schedule Requirement
    await ScheduleRequirement.create({
      ScheduleId: findSchedule.id,
      RequirementId: findRequirement.id
    })

    res.status(201).json({
      code: '201',
      status: 'CREATED'
    })
  } catch (err) {
    next(err)
  }
}