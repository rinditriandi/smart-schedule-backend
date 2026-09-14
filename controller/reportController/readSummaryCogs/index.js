const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { page, year, month, group, profitCenter, wbsCode } = req.query
    if (!month || !year) throw { code: '400', errors: ['year and month are required'] }
    let startWbsPeriod = new Date(Number(year), Number(month), 1)
    let endWbsPeriod = new Date(Number(year), Number(month) + 1, 0)
    startWbsPeriod.setHours(0, 0, 0, 0)
    endWbsPeriod.setHours(23, 59, 0, 0)

    const limit = 10
    const totalPlot = await Plot.findAll({
      attributes: ['id'],
      where: {
        group: {
          [Op.like]: `%${group || ''}%`
        },
        profitCenter: {
          [Op.and]: [
            {
              [Op.like]: `%${profitCenter || ''}%`
            },
            {
              [Op.ne]: '0000032204'
            },
            {
              [Op.ne]: '0000032104'
            },
          ]
        },
        wbs: {
          [Op.like]: `%${wbsCode || ''}%`
        },
        sapId: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Schedule,
          attributes: ['id', 'PlotId', 'startHours', 'endHours', 'startHoursString'],
          where: {
            startHours: {
              [Op.between]: [startWbsPeriod.getTime(), endWbsPeriod.getTime()]
            },
            isDeleted: {
              [Op.or]: [null, 0]
            },
            isCanceled: {
              [Op.or]: [null, 0]
            },
            gcalEventId: {
              [Op.ne]: null
            },
            ActivityTypeId: 6
          },
          required: true
        }
      ],
    })

    const findPlot = await Plot.findAll({
      limit,
      offset: (Number(page) - 1) * limit,
      attributes: ['id', 'group', 'profitCenter', 'wbs', 'sapId', 'name', 'OpportunityId', 'topic', 'client', 'programCategory', 'sales'],
      where: {
        group: {
          [Op.like]: `%${group || ''}%`
        },
        profitCenter: {
          [Op.and]: [
            {
              [Op.like]: `%${profitCenter || ''}%`
            },
            {
              [Op.ne]: '0000032204'
            },
            {
              [Op.ne]: '0000032104'
            },
          ]
        },
        wbs: {
          [Op.like]: `%${wbsCode || ''}%`
        },
        sapId: {
          [Op.ne]: null
        }
      },
      include: [
        {
          model: Schedule,
          attributes: ['id', 'PlotId', 'startHours', 'endHours', 'startHoursString'],
          where: {
            startHours: {
              [Op.between]: [startWbsPeriod.getTime(), endWbsPeriod.getTime()]
            },
            isDeleted: {
              [Op.or]: [null, 0]
            },
            isCanceled: {
              [Op.or]: [null, 0]
            },
            gcalEventId: {
              [Op.ne]: null
            },
            ActivityTypeId: 6
          }
        }
      ],
    })
    const findSchedules = await Schedule.findAll({
      attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration'],
      where: {
        startHours: {
          [Op.between]: [startWbsPeriod.getTime(), endWbsPeriod.getTime()]
        },
        isDeleted: {
          [Op.or]: [null, 0]
        },
        isCanceled: {
          [Op.or]: [null, 0]
        },
        gcalEventId: {
          [Op.ne]: null
        },
        ActivityTypeId: 6
      },
      include: [
        {
          model: Plot,
          attributes: ['id', 'group', 'profitCenter', 'wbs'],
          where: {
            group: {
              [Op.like]: `%${group || ''}%`
            },
            profitCenter: {
              [Op.and]: [
                {
                  [Op.like]: `%${profitCenter || ''}%`
                },
                {
                  [Op.ne]: '0000032204'
                },
                {
                  [Op.ne]: '0000032104'
                },
              ]
            },
            wbs: {
              [Op.like]: `%${wbsCode || ''}%`
            },
            sapId: {
              [Op.ne]: null
            }
          },
          required: true
        }
      ]
    })

    let totalHours = 0
    findSchedules.forEach(scheduleItem => {
      let duration = (Number(scheduleItem.dataValues.endHours) - Number(scheduleItem.dataValues.startHours) - Number(scheduleItem?.dataValues?.breakDuration || 0)) / 1000 / 3600

      totalHours += duration
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        totalItems: totalPlot.length,
        items: findPlot,
        totalPages: findPlot.length == 0 ? 1 : Math.ceil(totalPlot.length / limit),
        currentPage: Number(page),
        totalHours: totalHours
      }
    })
  } catch (err) {
    next(err)
  }
}