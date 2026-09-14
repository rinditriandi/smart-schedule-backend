const { checkAvailability } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { ConsultantId, startHours, endHours } = req.body
    if (!startHours || !endHours) throw { code: '400', errors: ['start hours and end hours is required'] }

    const sameSchedules = await checkAvailability({
      ConsultantId,
      startHours,
      endHours
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        sameSchedules
      }
    })
  } catch (err) {
    next(err)
  }
}