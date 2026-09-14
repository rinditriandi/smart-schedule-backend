const { ActivityType } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { search } = req.query
    const activityTypes = await ActivityType.findAll({
      where: {
        [Op.or]: [
          {
            label: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
          {
            apiName: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
        ]
      }
    })
    res.status(200).json({
      code: '200',
      status: 'OK',
      data: activityTypes
    })
  } catch (err) {
    next(err)
  }
}