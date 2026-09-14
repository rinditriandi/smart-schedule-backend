const { Consultant } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { search } = req.query
    const consultants = await Consultant.findAll({
      where: {
        [Op.or]: [
          {
            id: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
          {
            name: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
          {
            alias: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
          {
            email: {
              [Op.like]: search ? `%${search}%` : '%'
            }
          },
        ]
      }
    })
    res.status(200).json({
      code: '200',
      status: 'OK',
      data: consultants
    })
  } catch (err) {
    next(err)
  }
}