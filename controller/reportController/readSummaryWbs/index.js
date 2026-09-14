const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { page, year, group, profitCenter, wbsCode } = req.query
    if (!year) throw { code: '400', errors: ['year is required'] }
    let startWbsPeriod = new Date(Number(year), Number(0), 1)
    let endWbsPeriod = new Date(Number(year), Number(11) + 1, 0)
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
          attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration'],
          include: [
            {
              model: ConsultantSchedule,
              attributes: ['ConsultantId'],
              include: [
                {
                  model: Consultant,
                  attributes: ['type']
                }
              ]
            }
          ],
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

    const plotsMap = findPlot.map(item => {
      let schedules_ = [...item.dataValues.Schedules]
      let rcTypeDuration = 0
      let acTypeDuration = 0
      let otherTypeDuration = 0
      let totalTypeDuration = 0

      schedules_.forEach(scheduleItem => {
        let type = scheduleItem.ConsultantSchedules[0].Consultant.type
        let duration_ = (Number(scheduleItem.endHours) - Number(scheduleItem.startHours) - Number(scheduleItem.breakDuration)) / 1000 / 3600

        if (type === 'RC') {
          rcTypeDuration += duration_
        } else if (type === 'AC') {
          acTypeDuration += duration_
        } else {
          otherTypeDuration += duration_
        }

        totalTypeDuration += duration_
      })

      return {
        ...item.dataValues,
        rcTypeDuration,
        acTypeDuration,
        otherTypeDuration,
        totalTypeDuration
      }
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        totalItems: totalPlot.length,
        items: plotsMap,
        totalPages: findPlot.length == 0 ? 1 : Math.ceil(totalPlot.length / limit),
        currentPage: Number(page)
      }
    })
  } catch (err) {
    next(err)
  }
}