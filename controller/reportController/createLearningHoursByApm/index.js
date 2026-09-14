const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')
const writeXlsxFile = require('write-excel-file/node')
const fs = require('fs')

module.exports = async (req, res, next) => {
  try {
    const { year } = req.body
    let year_ = year ? Number(year) : new Date().getFullYear()

    const schedules = []

    // Fetch January - April
    const januaryTime = new Date(Number(year_), 0, 1)
    const aprilTime = new Date(Number(year_), 3, 30, 23, 59)
    const findPlotsQ1 = await Plot.findAll({
      include: [
        {
          model: Schedule,
          attributes: ['id', 'startHours', 'endHours', 'breakDuration', 'PlotId'],
          where: {
            startHours: {
              [Op.between]: [januaryTime.getTime(), aprilTime.getTime()]
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
      where: {
        sapId: {
          [Op.ne]: null
        },
        profitCenter: {
          [Op.and]: [
            {
              [Op.ne]: '0000032204'
            },
            {
              [Op.ne]: '0000032104'
            },
          ]
        },
      },
      attributes: ['id', 'wbsPeriod', 'wbsPeriodString', 'group']
    })
    findPlotsQ1.forEach(plotItem => {
      plotItem.dataValues.Schedules.forEach(scheduleItem => {
        schedules.push({ ...scheduleItem.dataValues, group: plotItem.dataValues.group })
      })
    })

    // Fetch May - Aug
    const mayTime = new Date(Number(year_), 4, 1)
    const augTime = new Date(Number(year_), 7, 30, 23, 59)
    const findPlotsQ2 = await Plot.findAll({
      include: [
        {
          model: Schedule,
          attributes: ['id', 'startHours', 'endHours', 'breakDuration', 'PlotId'],
          where: {
            startHours: {
              [Op.between]: [mayTime.getTime(), augTime.getTime()]
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
      where: {
        sapId: {
          [Op.ne]: null
        },
        profitCenter: {
          [Op.and]: [
            {
              [Op.ne]: '0000032204'
            },
            {
              [Op.ne]: '0000032104'
            },
          ]
        },
      },
      attributes: ['id', 'wbsPeriod', 'wbsPeriodString', 'group']
    })
    findPlotsQ2.forEach(plotItem => {
      plotItem.dataValues.Schedules.forEach(scheduleItem => {
        schedules.push({ ...scheduleItem.dataValues, group: plotItem.dataValues.group })
      })
    })

    // Fetch Sep - Dec
    const sepTime = new Date(Number(year_), 8, 1)
    const decTime = new Date(Number(year_), 11, 30, 23, 59)
    const findPlotsQ3 = await Plot.findAll({
      include: [
        {
          model: Schedule,
          attributes: ['id', 'startHours', 'endHours', 'breakDuration', 'PlotId'],
          where: {
            startHours: {
              [Op.between]: [sepTime.getTime(), decTime.getTime()]
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
      where: {
        sapId: {
          [Op.ne]: null
        },
        profitCenter: {
          [Op.and]: [
            {
              [Op.ne]: '0000032204'
            },
            {
              [Op.ne]: '0000032104'
            },
          ]
        },
      },
      attributes: ['id', 'wbsPeriod', 'wbsPeriodString', 'group']
    })
    findPlotsQ3.forEach(plotItem => {
      plotItem.dataValues.Schedules.forEach(scheduleItem => {
        schedules.push({ ...scheduleItem.dataValues, group: plotItem.dataValues.group })
      })
    })

    let apmpHoursJanuary = 0
    let apmpHoursFebruary = 0
    let apmpHoursMarch = 0
    let apmpHoursApril = 0
    let apmpHoursMay = 0
    let apmpHoursJune = 0
    let apmpHoursJuly = 0
    let apmpHoursAugust = 0
    let apmpHoursSeptember = 0
    let apmpHoursOctober = 0
    let apmpHoursNovember = 0
    let apmpHoursDecember = 0

    let apmc1HoursJanuary = 0
    let apmc1HoursFebruary = 0
    let apmc1HoursMarch = 0
    let apmc1HoursApril = 0
    let apmc1HoursMay = 0
    let apmc1HoursJune = 0
    let apmc1HoursJuly = 0
    let apmc1HoursAugust = 0
    let apmc1HoursSeptember = 0
    let apmc1HoursOctober = 0
    let apmc1HoursNovember = 0
    let apmc1HoursDecember = 0

    let apmc2HoursJanuary = 0
    let apmc2HoursFebruary = 0
    let apmc2HoursMarch = 0
    let apmc2HoursApril = 0
    let apmc2HoursMay = 0
    let apmc2HoursJune = 0
    let apmc2HoursJuly = 0
    let apmc2HoursAugust = 0
    let apmc2HoursSeptember = 0
    let apmc2HoursOctober = 0
    let apmc2HoursNovember = 0
    let apmc2HoursDecember = 0

    schedules.forEach(scheduleItem => {
      let durationHours = (Number(scheduleItem.endHours) - Number(scheduleItem.startHours) - Number(scheduleItem?.breakDuration || 0)) / 1000 / 3600
      let month = new Date(scheduleItem.startHours).getMonth()

      if (scheduleItem.group === 'APM P') {
        if (month === 0) {
          apmpHoursJanuary += durationHours
        } else if (month === 1) {
          apmpHoursFebruary += durationHours
        } else if (month === 2) {
          apmpHoursMarch += durationHours
        } else if (month === 3) {
          apmpHoursApril += durationHours
        } else if (month === 4) {
          apmpHoursMay += durationHours
        } else if (month === 5) {
          apmpHoursJune += durationHours
        } else if (month === 6) {
          apmpHoursJuly += durationHours
        } else if (month === 7) {
          apmpHoursAugust += durationHours
        } else if (month === 8) {
          apmpHoursSeptember += durationHours
        } else if (month === 9) {
          apmpHoursOctober += durationHours
        } else if (month === 10) {
          apmpHoursNovember += durationHours
        } else if (month === 11) {
          apmpHoursDecember += durationHours
        }
      }

      if (scheduleItem.group === 'APM C1') {
        if (month === 0) {
          apmc1HoursJanuary += durationHours
        } else if (month === 1) {
          apmc1HoursFebruary += durationHours
        } else if (month === 2) {
          apmc1HoursMarch += durationHours
        } else if (month === 3) {
          apmc1HoursApril += durationHours
        } else if (month === 4) {
          apmc1HoursMay += durationHours
        } else if (month === 5) {
          apmc1HoursJune += durationHours
        } else if (month === 6) {
          apmc1HoursJuly += durationHours
        } else if (month === 7) {
          apmc1HoursAugust += durationHours
        } else if (month === 8) {
          apmc1HoursSeptember += durationHours
        } else if (month === 9) {
          apmc1HoursOctober += durationHours
        } else if (month === 10) {
          apmc1HoursNovember += durationHours
        } else if (month === 11) {
          apmc1HoursDecember += durationHours
        }
      }
      if (scheduleItem.group === 'APM C2') {
        if (month === 0) {
          apmc2HoursJanuary += durationHours
        } else if (month === 1) {
          apmc2HoursFebruary += durationHours
        } else if (month === 2) {
          apmc2HoursMarch += durationHours
        } else if (month === 3) {
          apmc2HoursApril += durationHours
        } else if (month === 4) {
          apmc2HoursMay += durationHours
        } else if (month === 5) {
          apmc2HoursJune += durationHours
        } else if (month === 6) {
          apmc2HoursJuly += durationHours
        } else if (month === 7) {
          apmc2HoursAugust += durationHours
        } else if (month === 8) {
          apmc2HoursSeptember += durationHours
        } else if (month === 9) {
          apmc2HoursOctober += durationHours
        } else if (month === 10) {
          apmc2HoursNovember += durationHours
        } else if (month === 11) {
          apmc2HoursDecember += durationHours
        }
      }
    })

    // Create excel
    const filename = `learning-hours-by-apm-${randomString({ length: 3 })}.xlsx`
    const headerExcel = [
      {
        value: '',
      },
      {
        value: 'APM P',
        fontWeight: 'bold'
      },
      {
        value: 'APM C1',
        fontWeight: 'bold'
      },
      {
        value: 'APM C2',
        fontWeight: 'bold'
      }
    ]

    const dataExcel = [
      [
        {
          type: String,
          value: 'January'
        },
        {
          type: Number,
          value: apmpHoursJanuary
        },
        {
          type: Number,
          value: apmc1HoursJanuary
        },
        {
          type: Number,
          value: apmc2HoursJanuary
        },
      ],
      [
        {
          type: String,
          value: 'February'
        },
        {
          type: Number,
          value: apmpHoursFebruary
        },
        {
          type: Number,
          value: apmc1HoursFebruary
        },
        {
          type: Number,
          value: apmc2HoursFebruary
        },
      ],
      [
        {
          type: String,
          value: 'March'
        },
        {
          type: Number,
          value: apmpHoursMarch
        },
        {
          type: Number,
          value: apmc1HoursMarch
        },
        {
          type: Number,
          value: apmc2HoursMarch
        },
      ],
      [
        {
          type: String,
          value: 'April'
        },
        {
          type: Number,
          value: apmpHoursApril
        },
        {
          type: Number,
          value: apmc1HoursApril
        },
        {
          type: Number,
          value: apmc2HoursApril
        },
      ],
      [
        {
          type: String,
          value: 'May'
        },
        {
          type: Number,
          value: apmpHoursMay
        },
        {
          type: Number,
          value: apmc1HoursMay
        },
        {
          type: Number,
          value: apmc2HoursMay
        },
      ],
      [
        {
          type: String,
          value: 'June'
        },
        {
          type: Number,
          value: apmpHoursJune
        },
        {
          type: Number,
          value: apmc1HoursJune
        },
        {
          type: Number,
          value: apmc2HoursJune
        },
      ],
      [
        {
          type: String,
          value: 'July'
        },
        {
          type: Number,
          value: apmpHoursJuly
        },
        {
          type: Number,
          value: apmc1HoursJuly
        },
        {
          type: Number,
          value: apmc2HoursJuly
        },
      ],
      [
        {
          type: String,
          value: 'August'
        },
        {
          type: Number,
          value: apmpHoursAugust
        },
        {
          type: Number,
          value: apmc1HoursAugust
        },
        {
          type: Number,
          value: apmc2HoursAugust
        },
      ],
      [
        {
          type: String,
          value: 'September'
        },
        {
          type: Number,
          value: apmpHoursSeptember
        },
        {
          type: Number,
          value: apmc1HoursSeptember
        },
        {
          type: Number,
          value: apmc2HoursSeptember
        },
      ],
      [
        {
          type: String,
          value: 'October'
        },
        {
          type: Number,
          value: apmpHoursOctober
        },
        {
          type: Number,
          value: apmc1HoursOctober
        },
        {
          type: Number,
          value: apmc2HoursOctober
        },
      ],
      [
        {
          type: String,
          value: 'November'
        },
        {
          type: Number,
          value: apmpHoursNovember
        },
        {
          type: Number,
          value: apmc1HoursNovember
        },
        {
          type: Number,
          value: apmc2HoursNovember
        },
      ],
      [
        {
          type: String,
          value: 'December'
        },
        {
          type: Number,
          value: apmpHoursDecember
        },
        {
          type: Number,
          value: apmc1HoursDecember
        },
        {
          type: Number,
          value: apmc2HoursDecember
        },
      ],
    ]

    await writeXlsxFile([headerExcel, ...dataExcel], {
      filePath: `assets/${filename}`
    })

    setTimeout(() => {
      fs.unlinkSync(`assets/${filename}`)
    }, 120000)

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        link: `${process.env.DNS}/api/assets/${filename}`,
        expiredIn: '2 minutes'
      }
    })
  } catch (err) {
    next(err)
  }
}