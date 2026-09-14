const { ClassType } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { search } = req.query
    const classTypes = await ClassType.findAll({
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
      data: classTypes
    })
  } catch (err) {
    next(err)
  }
}