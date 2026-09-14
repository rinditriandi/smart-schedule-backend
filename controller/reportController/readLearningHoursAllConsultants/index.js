const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { page = 1, startHours, endHours, group, profitCenter, wbsCode, consultantId } = req.query
    if (!startHours || !endHours) throw { code: '400', errors: ['start hours and end hours are required'] }
    let startHours_ = new Date(Number(startHours))
    let endHours_ = new Date(Number(endHours))
    startHours_.setHours(0, 0, 0, 0)
    endHours_.setHours(23, 59, 0, 0)

    const limit = 10

    const findSchedules_ = await Schedule.findAll({
      attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration', 'totalMinutes', 'totalHours'],
      order: [['startHours', 'ASC']],
      where: {
        startHours: {
          [Op.between]: [startHours_.getTime(), endHours_.getTime()]
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
          attributes: ['id', 'profitCenter', 'client', 'topic', 'wbs', 'group', 'sapId'],
          where: {
            group: {
              [Op.like]: `%${group || ''}%`
            },
            profitCenter: {
              [Op.like]: `%${profitCenter || ''}%`
            },
            wbs: {
              [Op.like]: `%${wbsCode || ''}%`
            },
            sapId: {
              [Op.ne]: null
            }
          },
          required: true
        },
        {
          model: ConsultantSchedule,
          attributes: ['ConsultantId', 'ScheduleId'],
          where: {
            ConsultantId: {
              [Op.like]: `%${consultantId || ''}%`
            },
          },
          include: [
            {
              model: Consultant,
              attributes: ['alias'],
            }
          ],
          required: true
        },
      ]
    })

    let totalDurationMilliseconds = 0

    findSchedules_.forEach(scheduleItem => {
      let startHours_ = scheduleItem.dataValues.startHours
      let endHours_ = scheduleItem.dataValues.endHours
      let breakDuration_ = scheduleItem.dataValues.breakDuration || 0
      let duration_ = endHours_ - startHours_ - breakDuration_

      totalDurationMilliseconds += duration_
    })

    const findSchedules = await Schedule.findAll({
      limit,
      offset: (Number(page) - 1) * limit,
      attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration', 'totalMinutes', 'totalHours'],
      order: [['startHours', 'ASC']],
      where: {
        startHours: {
          [Op.between]: [startHours_.getTime(), endHours_.getTime()]
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
          attributes: ['id', 'profitCenter', 'client', 'topic', 'wbs', 'group', 'sapId'],
          where: {
            group: {
              [Op.like]: `%${group || ''}%`
            },
            profitCenter: {
              [Op.like]: `%${profitCenter || ''}%`
            },
            wbs: {
              [Op.like]: `%${wbsCode || ''}%`
            },
            sapId: {
              [Op.ne]: null
            }
          },
          required: true
        },
        {
          model: ConsultantSchedule,
          attributes: ['ConsultantId', 'ScheduleId'],
          where: {
            ConsultantId: {
              [Op.like]: `%${consultantId || ''}%`
            },
          },
          include: [
            {
              model: Consultant,
              attributes: ['alias']
            }
          ],
          required: true
        },
      ]
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        totalItems: findSchedules_.length,
        items: findSchedules,
        totalPages: findSchedules.length == 0 ? 1 : Math.ceil(findSchedules_.length / limit),
        currentPage: Number(page),
        totalDurationMilliseconds: totalDurationMilliseconds
      }
    })
  } catch (err) {
    next(err)
  }
}