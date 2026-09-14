const { Consultant, ConsultantType } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { search } = req.query
    const consultantTypes = await ConsultantType.findAll({
      where: {
        [Op.or]: [
          {
            apiName: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
          {
            label: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          }
        ]
      }
    })
    res.status(200).json({
      code: '200',
      status: 'OK',
      data: consultantTypes
    })
  } catch (err) {
    next(err)
  }
}