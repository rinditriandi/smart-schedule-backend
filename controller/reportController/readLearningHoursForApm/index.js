const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')

const handleSapIdFilter = isSyncSap => {
  if (isSyncSap === 'true') {
    return {
      [Op.ne]: null
    }
  } else if (isSyncSap === 'false') {
    return {
      [Op.eq]: null
    }
  } else {
    return {
      [Op.or]: [
        {
          [Op.ne]: null
        },
        {
          [Op.eq]: null
        }
      ]
    }
  }
}

const handleGcalFilter = isSync => {
  if (isSync === 'true') {
    return {
      [Op.ne]: null
    }
  } else if (isSync === 'false') {
    return {
      [Op.eq]: null
    }
  } else {
    return {
      [Op.or]: [
        {
          [Op.ne]: null
        },
        {
          [Op.eq]: null
        }
      ]
    }
  }
}

module.exports = async (req, res, next) => {
  try {
    const { page = 1, startHours, endHours, group, profitCenter, wbsCode, consultantId, isSyncSap, isGcalSync, consultantType } = req.query
    if (!startHours || !endHours) throw { code: '400', errors: ['start hours and end hours are required'] }
    let startHours_ = new Date(Number(startHours))
    let endHours_ = new Date(Number(endHours))
    startHours_.setHours(0, 0, 0, 0)
    endHours_.setHours(23, 59, 0, 0)

    const limit = 10

    const findSchedules_ = await Schedule.findAll({
      attributes: ['startHours', 'endHours', 'breakDuration', 'gcalEventId'],
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
        gcalEventId: handleGcalFilter(isGcalSync),
        ActivityTypeId: 6
      },
      include: [
        {
          model: Plot,
          attributes: ['id', 'profitCenter', 'client', 'topic', 'wbs', 'group', 'sapId', 'odooWbsId'],
          where: {
            group: {
              [Op.like]: `%${group || ''}%`
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
              attributes: ['alias', 'type']
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
      attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration', 'totalMinutes', 'totalHours', 'gcalEventId'],
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
        gcalEventId: handleGcalFilter(isGcalSync),
        ActivityTypeId: 6
      },
      include: [
        {
          model: Plot,
          attributes: ['id', 'profitCenter', 'client', 'topic', 'wbs', 'group', 'sapId', 'odooWbsId'],
          where: {
            group: {
              [Op.like]: `%${group || ''}%`
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
              attributes: ['alias', 'type']
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