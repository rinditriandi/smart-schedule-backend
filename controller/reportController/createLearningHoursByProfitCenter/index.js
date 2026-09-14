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
      attributes: ['id', 'wbsPeriod', 'wbsPeriodString', 'profitCenter']
    })
    findPlotsQ1.forEach(plotItem => {
      plotItem.dataValues.Schedules.forEach(scheduleItem => {
        schedules.push({ ...scheduleItem.dataValues, profitCenter: plotItem.dataValues.profitCenter })
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
      attributes: ['id', 'wbsPeriod', 'wbsPeriodString', 'profitCenter']
    })
    findPlotsQ2.forEach(plotItem => {
      plotItem.dataValues.Schedules.forEach(scheduleItem => {
        schedules.push({ ...scheduleItem.dataValues, profitCenter: plotItem.dataValues.profitCenter })
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
      attributes: ['id', 'wbsPeriod', 'wbsPeriodString', 'profitCenter']
    })
    findPlotsQ3.forEach(plotItem => {
      plotItem.dataValues.Schedules.forEach(scheduleItem => {
        schedules.push({ ...scheduleItem.dataValues, profitCenter: plotItem.dataValues.profitCenter })
      })
    })

    let shortProgramHoursJanuary = 0
    let shortProgramHoursFebruary = 0
    let shortProgramHoursMarch = 0
    let shortProgramHoursApril = 0
    let shortProgramHoursMay = 0
    let shortProgramHoursJune = 0
    let shortProgramHoursJuly = 0
    let shortProgramHoursAugust = 0
    let shortProgramHoursSeptember = 0
    let shortProgramHoursOctober = 0
    let shortProgramHoursNovember = 0
    let shortProgramHoursDecember = 0

    let certificationProgramHoursJanuary = 0
    let certificationProgramHoursFebruary = 0
    let certificationProgramHoursMarch = 0
    let certificationProgramHoursApril = 0
    let certificationProgramHoursMay = 0
    let certificationProgramHoursJune = 0
    let certificationProgramHoursJuly = 0
    let certificationProgramHoursAugust = 0
    let certificationProgramHoursSeptember = 0
    let certificationProgramHoursOctober = 0
    let certificationProgramHoursNovember = 0
    let certificationProgramHoursDecember = 0

    let inCompanyAssessmentHoursJanuary = 0
    let inCompanyAssessmentHoursFebruary = 0
    let inCompanyAssessmentHoursMarch = 0
    let inCompanyAssessmentHoursApril = 0
    let inCompanyAssessmentHoursMay = 0
    let inCompanyAssessmentHoursJune = 0
    let inCompanyAssessmentHoursJuly = 0
    let inCompanyAssessmentHoursAugust = 0
    let inCompanyAssessmentHoursSeptember = 0
    let inCompanyAssessmentHoursOctober = 0
    let inCompanyAssessmentHoursNovember = 0
    let inCompanyAssessmentHoursDecember = 0

    let corporateProgramHoursJanuary = 0
    let corporateProgramHoursFebruary = 0
    let corporateProgramHoursMarch = 0
    let corporateProgramHoursApril = 0
    let corporateProgramHoursMay = 0
    let corporateProgramHoursJune = 0
    let corporateProgramHoursJuly = 0
    let corporateProgramHoursAugust = 0
    let corporateProgramHoursSeptember = 0
    let corporateProgramHoursOctober = 0
    let corporateProgramHoursNovember = 0
    let corporateProgramHoursDecember = 0

    let ictHoursJanuary = 0
    let ictHoursFebruary = 0
    let ictHoursMarch = 0
    let ictHoursApril = 0
    let ictHoursMay = 0
    let ictHoursJune = 0
    let ictHoursJuly = 0
    let ictHoursAugust = 0
    let ictHoursSeptember = 0
    let ictHoursOctober = 0
    let ictHoursNovember = 0
    let ictHoursDecember = 0

    let consultationProgramHoursJanuary = 0
    let consultationProgramHoursFebruary = 0
    let consultationProgramHoursMarch = 0
    let consultationProgramHoursApril = 0
    let consultationProgramHoursMay = 0
    let consultationProgramHoursJune = 0
    let consultationProgramHoursJuly = 0
    let consultationProgramHoursAugust = 0
    let consultationProgramHoursSeptember = 0
    let consultationProgramHoursOctober = 0
    let consultationProgramHoursNovember = 0
    let consultationProgramHoursDecember = 0

    let assessmentProgramHoursJanuary = 0
    let assessmentProgramHoursFebruary = 0
    let assessmentProgramHoursMarch = 0
    let assessmentProgramHoursApril = 0
    let assessmentProgramHoursMay = 0
    let assessmentProgramHoursJune = 0
    let assessmentProgramHoursJuly = 0
    let assessmentProgramHoursAugust = 0
    let assessmentProgramHoursSeptember = 0
    let assessmentProgramHoursOctober = 0
    let assessmentProgramHoursNovember = 0
    let assessmentProgramHoursDecember = 0

    schedules.forEach(scheduleItem => {
      let durationHours = (Number(scheduleItem.endHours) - Number(scheduleItem.startHours) - Number(scheduleItem?.breakDuration || 0)) / 1000 / 3600
      let month = new Date(scheduleItem.startHours).getMonth()

      if (scheduleItem.profitCenter === '0000032101') {
        if (month === 0) {
          shortProgramHoursJanuary += durationHours
        } else if (month === 1) {
          shortProgramHoursFebruary += durationHours
        } else if (month === 2) {
          shortProgramHoursMarch += durationHours
        } else if (month === 3) {
          shortProgramHoursApril += durationHours
        } else if (month === 4) {
          shortProgramHoursMay += durationHours
        } else if (month === 5) {
          shortProgramHoursJune += durationHours
        } else if (month === 6) {
          shortProgramHoursJuly += durationHours
        } else if (month === 7) {
          shortProgramHoursAugust += durationHours
        } else if (month === 8) {
          shortProgramHoursSeptember += durationHours
        } else if (month === 9) {
          shortProgramHoursOctober += durationHours
        } else if (month === 10) {
          shortProgramHoursNovember += durationHours
        } else if (month === 11) {
          shortProgramHoursDecember += durationHours
        }
      }

      if (scheduleItem.profitCenter === '0000032102') {
        if (month === 0) {
          certificationProgramHoursJanuary += durationHours
        } else if (month === 1) {
          certificationProgramHoursFebruary += durationHours
        } else if (month === 2) {
          certificationProgramHoursMarch += durationHours
        } else if (month === 3) {
          certificationProgramHoursApril += durationHours
        } else if (month === 4) {
          certificationProgramHoursMay += durationHours
        } else if (month === 5) {
          certificationProgramHoursJune += durationHours
        } else if (month === 6) {
          certificationProgramHoursJuly += durationHours
        } else if (month === 7) {
          certificationProgramHoursAugust += durationHours
        } else if (month === 8) {
          certificationProgramHoursSeptember += durationHours
        } else if (month === 9) {
          certificationProgramHoursOctober += durationHours
        } else if (month === 10) {
          certificationProgramHoursNovember += durationHours
        } else if (month === 11) {
          certificationProgramHoursDecember += durationHours
        }
      }

      if (scheduleItem.profitCenter === '0000032104') {
        if (month === 0) {
          inCompanyAssessmentHoursJanuary += durationHours
        } else if (month === 1) {
          inCompanyAssessmentHoursFebruary += durationHours
        } else if (month === 2) {
          inCompanyAssessmentHoursMarch += durationHours
        } else if (month === 3) {
          inCompanyAssessmentHoursApril += durationHours
        } else if (month === 4) {
          inCompanyAssessmentHoursMay += durationHours
        } else if (month === 5) {
          inCompanyAssessmentHoursJune += durationHours
        } else if (month === 6) {
          inCompanyAssessmentHoursJuly += durationHours
        } else if (month === 7) {
          inCompanyAssessmentHoursAugust += durationHours
        } else if (month === 8) {
          inCompanyAssessmentHoursSeptember += durationHours
        } else if (month === 9) {
          inCompanyAssessmentHoursOctober += durationHours
        } else if (month === 10) {
          inCompanyAssessmentHoursNovember += durationHours
        } else if (month === 11) {
          inCompanyAssessmentHoursDecember += durationHours
        }
      }

      if (scheduleItem.profitCenter === '0000032201') {
        if (month === 0) {
          corporateProgramHoursJanuary += durationHours
        } else if (month === 1) {
          corporateProgramHoursFebruary += durationHours
        } else if (month === 2) {
          corporateProgramHoursMarch += durationHours
        } else if (month === 3) {
          corporateProgramHoursApril += durationHours
        } else if (month === 4) {
          corporateProgramHoursMay += durationHours
        } else if (month === 5) {
          corporateProgramHoursJune += durationHours
        } else if (month === 6) {
          corporateProgramHoursJuly += durationHours
        } else if (month === 7) {
          corporateProgramHoursAugust += durationHours
        } else if (month === 8) {
          corporateProgramHoursSeptember += durationHours
        } else if (month === 9) {
          corporateProgramHoursOctober += durationHours
        } else if (month === 10) {
          corporateProgramHoursNovember += durationHours
        } else if (month === 11) {
          corporateProgramHoursDecember += durationHours
        }
      }

      if (scheduleItem.profitCenter === '0000032105') {
        if (month === 0) {
          ictHoursJanuary += durationHours
        } else if (month === 1) {
          ictHoursFebruary += durationHours
        } else if (month === 2) {
          ictHoursMarch += durationHours
        } else if (month === 3) {
          ictHoursApril += durationHours
        } else if (month === 4) {
          ictHoursMay += durationHours
        } else if (month === 5) {
          ictHoursJune += durationHours
        } else if (month === 6) {
          ictHoursJuly += durationHours
        } else if (month === 7) {
          ictHoursAugust += durationHours
        } else if (month === 8) {
          ictHoursSeptember += durationHours
        } else if (month === 9) {
          ictHoursOctober += durationHours
        } else if (month === 10) {
          ictHoursNovember += durationHours
        } else if (month === 11) {
          ictHoursDecember += durationHours
        }
      }

      if (scheduleItem.profitCenter === '0000032203') {
        if (month === 0) {
          consultationProgramHoursJanuary += durationHours
        } else if (month === 1) {
          consultationProgramHoursFebruary += durationHours
        } else if (month === 2) {
          consultationProgramHoursMarch += durationHours
        } else if (month === 3) {
          consultationProgramHoursApril += durationHours
        } else if (month === 4) {
          consultationProgramHoursMay += durationHours
        } else if (month === 5) {
          consultationProgramHoursJune += durationHours
        } else if (month === 6) {
          consultationProgramHoursJuly += durationHours
        } else if (month === 7) {
          consultationProgramHoursAugust += durationHours
        } else if (month === 8) {
          consultationProgramHoursSeptember += durationHours
        } else if (month === 9) {
          consultationProgramHoursOctober += durationHours
        } else if (month === 10) {
          consultationProgramHoursNovember += durationHours
        } else if (month === 11) {
          consultationProgramHoursDecember += durationHours
        }
      }

      if (scheduleItem.profitCenter === '0000032204') {
        if (month === 0) {
          assessmentProgramHoursJanuary += durationHours
        } else if (month === 1) {
          assessmentProgramHoursFebruary += durationHours
        } else if (month === 2) {
          assessmentProgramHoursMarch += durationHours
        } else if (month === 3) {
          assessmentProgramHoursApril += durationHours
        } else if (month === 4) {
          assessmentProgramHoursMay += durationHours
        } else if (month === 5) {
          assessmentProgramHoursJune += durationHours
        } else if (month === 6) {
          assessmentProgramHoursJuly += durationHours
        } else if (month === 7) {
          assessmentProgramHoursAugust += durationHours
        } else if (month === 8) {
          assessmentProgramHoursSeptember += durationHours
        } else if (month === 9) {
          assessmentProgramHoursOctober += durationHours
        } else if (month === 10) {
          assessmentProgramHoursNovember += durationHours
        } else if (month === 11) {
          assessmentProgramHoursDecember += durationHours
        }
      }
    })

    // Create excel
    const filename = `learning-hours-by-profitcenter-${randomString({ length: 3 })}.xlsx`
    const headerExcel = [
      {
        value: '',
      },
      {
        value: 'SHORT PROGRAM 32101',
        fontWeight: 'bold'
      },
      {
        value: 'CERTIFICATION PROGRAM 32102',
        fontWeight: 'bold'
      },
      {
        value: 'IN COMPANY ASSESSMENT 32104',
        fontWeight: 'bold'
      },
      {
        value: 'CORPORATE PROGRAM 32201',
        fontWeight: 'bold'
      },
      {
        value: 'ICT 32105',
        fontWeight: 'bold'
      },
      {
        value: 'CONSULTATION PROGRAM 32203',
        fontWeight: 'bold'
      },
      {
        value: 'ASSESSMENT PROGRAM 32204',
        fontWeight: 'bold'
      },
    ]

    const dataExcel = [
      [
        {
          type: String,
          value: 'January'
        },
        {
          type: Number,
          value: shortProgramHoursJanuary
        },
        {
          type: Number,
          value: certificationProgramHoursJanuary
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursJanuary
        },
        {
          type: Number,
          value: corporateProgramHoursJanuary
        },
        {
          type: Number,
          value: ictHoursJanuary
        },
        {
          type: Number,
          value: consultationProgramHoursJanuary
        },
        {
          type: Number,
          value: assessmentProgramHoursJanuary
        },
      ],
      [
        {
          type: String,
          value: 'February'
        },
        {
          type: Number,
          value: shortProgramHoursFebruary
        },
        {
          type: Number,
          value: certificationProgramHoursFebruary
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursFebruary
        },
        {
          type: Number,
          value: corporateProgramHoursFebruary
        },
        {
          type: Number,
          value: ictHoursFebruary
        },
        {
          type: Number,
          value: consultationProgramHoursFebruary
        },
        {
          type: Number,
          value: assessmentProgramHoursFebruary
        },
      ],
      [
        {
          type: String,
          value: 'March'
        },
        {
          type: Number,
          value: shortProgramHoursMarch
        },
        {
          type: Number,
          value: certificationProgramHoursMarch
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursMarch
        },
        {
          type: Number,
          value: corporateProgramHoursMarch
        },
        {
          type: Number,
          value: ictHoursMarch
        },
        {
          type: Number,
          value: consultationProgramHoursMarch
        },
        {
          type: Number,
          value: assessmentProgramHoursMarch
        },
      ],
      [
        {
          type: String,
          value: 'April'
        },
        {
          type: Number,
          value: shortProgramHoursApril
        },
        {
          type: Number,
          value: certificationProgramHoursApril
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursApril
        },
        {
          type: Number,
          value: corporateProgramHoursApril
        },
        {
          type: Number,
          value: ictHoursApril
        },
        {
          type: Number,
          value: consultationProgramHoursApril
        },
        {
          type: Number,
          value: assessmentProgramHoursApril
        },
      ],
      [
        {
          type: String,
          value: 'May'
        },
        {
          type: Number,
          value: shortProgramHoursMay
        },
        {
          type: Number,
          value: certificationProgramHoursMay
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursMay
        },
        {
          type: Number,
          value: corporateProgramHoursMay
        },
        {
          type: Number,
          value: ictHoursMay
        },
        {
          type: Number,
          value: consultationProgramHoursMay
        },
        {
          type: Number,
          value: assessmentProgramHoursMay
        },
      ],
      [
        {
          type: String,
          value: 'June'
        },
        {
          type: Number,
          value: shortProgramHoursJune
        },
        {
          type: Number,
          value: certificationProgramHoursJune
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursJune
        },
        {
          type: Number,
          value: corporateProgramHoursJune
        },
        {
          type: Number,
          value: ictHoursJune
        },
        {
          type: Number,
          value: consultationProgramHoursJune
        },
        {
          type: Number,
          value: assessmentProgramHoursJune
        },
      ],
      [
        {
          type: String,
          value: 'July'
        },
        {
          type: Number,
          value: shortProgramHoursJuly
        },
        {
          type: Number,
          value: certificationProgramHoursJuly
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursJuly
        },
        {
          type: Number,
          value: corporateProgramHoursJuly
        },
        {
          type: Number,
          value: ictHoursJuly
        },
        {
          type: Number,
          value: consultationProgramHoursJuly
        },
        {
          type: Number,
          value: assessmentProgramHoursJuly
        },
      ],
      [
        {
          type: String,
          value: 'August'
        },
        {
          type: Number,
          value: shortProgramHoursAugust
        },
        {
          type: Number,
          value: certificationProgramHoursAugust
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursAugust
        },
        {
          type: Number,
          value: corporateProgramHoursAugust
        },
        {
          type: Number,
          value: ictHoursAugust
        },
        {
          type: Number,
          value: consultationProgramHoursAugust
        },
        {
          type: Number,
          value: assessmentProgramHoursAugust
        },
      ],
      [
        {
          type: String,
          value: 'September'
        },
        {
          type: Number,
          value: shortProgramHoursSeptember
        },
        {
          type: Number,
          value: certificationProgramHoursSeptember
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursSeptember
        },
        {
          type: Number,
          value: corporateProgramHoursSeptember
        },
        {
          type: Number,
          value: ictHoursSeptember
        },
        {
          type: Number,
          value: consultationProgramHoursSeptember
        },
        {
          type: Number,
          value: assessmentProgramHoursSeptember
        },
      ],
      [
        {
          type: String,
          value: 'October'
        },
        {
          type: Number,
          value: shortProgramHoursOctober
        },
        {
          type: Number,
          value: certificationProgramHoursOctober
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursOctober
        },
        {
          type: Number,
          value: corporateProgramHoursOctober
        },
        {
          type: Number,
          value: ictHoursOctober
        },
        {
          type: Number,
          value: consultationProgramHoursOctober
        },
        {
          type: Number,
          value: assessmentProgramHoursOctober
        },
      ],
      [
        {
          type: String,
          value: 'November'
        },
        {
          type: Number,
          value: shortProgramHoursNovember
        },
        {
          type: Number,
          value: certificationProgramHoursNovember
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursNovember
        },
        {
          type: Number,
          value: corporateProgramHoursNovember
        },
        {
          type: Number,
          value: ictHoursNovember
        },
        {
          type: Number,
          value: consultationProgramHoursNovember
        },
        {
          type: Number,
          value: assessmentProgramHoursNovember
        },
      ],
      [
        {
          type: String,
          value: 'December'
        },
        {
          type: Number,
          value: shortProgramHoursDecember
        },
        {
          type: Number,
          value: certificationProgramHoursDecember
        },
        {
          type: Number,
          value: inCompanyAssessmentHoursDecember
        },
        {
          type: Number,
          value: corporateProgramHoursDecember
        },
        {
          type: Number,
          value: ictHoursDecember
        },
        {
          type: Number,
          value: consultationProgramHoursDecember
        },
        {
          type: Number,
          value: assessmentProgramHoursDecember
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