const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')
const writeXlsxFile = require('write-excel-file/node')
const fs = require('fs')

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

module.exports = async (req, res, next) => {
  try {
    const { startHours, endHours, group, profitCenter, wbsCode, consultantId, isSyncSap } = req.body
    if (!startHours || !endHours) throw { code: '400', errors: ['start hours and end hours are required'] }
    let startHours_ = new Date(Number(startHours))
    let endHours_ = new Date(Number(endHours))
    startHours_.setHours(0, 0, 0, 0)
    endHours_.setHours(23, 59, 0, 0)

    const findSchedules = await Schedule.findAll({
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

    // Create excel
    const filename = `learning-hours-all-consultants-${randomString({ length: 5 })}.xlsx`
    const headerExcel = [
      {
        value: 'Profit Center',
        fontWeight: 'bold'
      },
      {
        value: 'Company',
        fontWeight: 'bold'
      },
      {
        value: 'Topic',
        fontWeight: 'bold'
      },
      {
        value: 'WBS Element Level 2',
        fontWeight: 'bold'
      },
      {
        value: 'SAP ID',
        fontWeight: 'bold'
      },
      {
        value: 'Teaching Date',
        fontWeight: 'bold'
      },
      {
        value: 'Consultant',
        fontWeight: 'bold'
      },
      {
        value: 'Time',
        fontWeight: 'bold'
      },
      {
        value: 'Break Duration in Minutes',
        fontWeight: 'bold'
      },
      {
        value: 'APM Group',
        fontWeight: 'bold'
      },
      {
        value: 'Minutes',
        fontWeight: 'bold'
      },
      {
        value: 'Session',
        fontWeight: 'bold'
      },
    ]

    const dataExcel = findSchedules?.map(findScheduleItem => {
      return [
        {
          type: String,
          value: findScheduleItem?.Plot?.profitCenter || '-',
        },
        {
          type: String,
          value: findScheduleItem?.Plot?.client || '-',
        },
        {
          type: String,
          value: findScheduleItem?.Plot?.topic || '-',
        },
        {
          type: String,
          value: findScheduleItem?.Plot?.wbs || '-',
        },
        {
          type: String,
          value: findScheduleItem?.Plot?.sapId || '-',
        },
        {
          type: String,
          value: new Intl.DateTimeFormat('id', { dateStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(findScheduleItem.startHours)),
        },
        {
          type: String,
          value: findScheduleItem.ConsultantSchedules.map(cs => cs.Consultant.alias).join(),
        },
        {
          type: String,
          value: `${new Intl.DateTimeFormat('id', { timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(findScheduleItem.startHours))} - ${new Intl.DateTimeFormat('id', { timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(findScheduleItem.endHours))}`
        },
        {
          type: Number,
          value: findScheduleItem.breakDuration != null ? Number(findScheduleItem.breakDuration) / 1000 / 60 : 0
        },
        {
          type: String,
          value: findScheduleItem?.Plot?.group || '-'
        },
        {
          type: Number,
          value: findScheduleItem.totalMinutes
        },
        {
          type: Number,
          value: findScheduleItem.totalHours
        },
      ]
    })

    await writeXlsxFile([headerExcel, ...dataExcel], {
      filePath: `assets/${filename}`
    })

    const response = {
      link: `${process.env.DNS}/api/assets/${filename}`,
      expiredIn: '2 minutes'
    }

    setTimeout(() => {
      fs.unlinkSync(`assets/${filename}`)
    }, 120000)

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: response
    })
  } catch (err) {
    next(err)
  }
}