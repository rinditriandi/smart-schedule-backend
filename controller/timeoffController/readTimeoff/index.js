const { Schedule, TimeoffType, Consultant, ActivityType } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { ConsultantId, dateFrom, dateTo, ActivityTypeId } = req.query

    if (!dateFrom || !dateTo) throw { code: '400', errors: ['start date and end date is required'] }

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

    // Find timeoff types
    const findTimeoffTypes = await TimeoffType.findAll()

    const findSchedules = await Schedule.findAll({
      where: {
        ActivityTypeId: ActivityTypeId ? ActivityTypeId : { [Op.or]: findTimeoffTypes.map(type => type.ActivityTypeId) },
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
      },
      include: [
        ...includeConsultant,
        {
          model: ActivityType
        }
      ],
      order: [['startHours', 'ASC']]
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findSchedules
    })
  } catch (err) {
    next(err)
  }
}