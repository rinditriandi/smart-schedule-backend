const { ScheduleRequirement } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const { ScheduleId, RequirementId } = req.body
    if (!ScheduleId || !RequirementId) throw { code: '400', errors: ['schedule id and requirement id are required'] }

    // Find Schedule Requirement
    const findScheduleRequirement = await ScheduleRequirement.findOne({
      where: {
        ScheduleId,
        RequirementId
      }
    })
    if (!findScheduleRequirement) throw { code: '404', errors: ['requirement not found'] }

    // Update Schedule Requirement
    await ScheduleRequirement.destroy({
      where: {
        ScheduleId,
        RequirementId
      }
    })

    res.status(200).json({
      code: '200',
      status: 'OK'
    })
  } catch (err) {
    next(err)
  }
}