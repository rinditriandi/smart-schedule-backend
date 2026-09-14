const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { year } = req.query
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

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        shortProgramHoursJanuary,
        shortProgramHoursFebruary,
        shortProgramHoursMarch,
        shortProgramHoursApril,
        shortProgramHoursMay,
        shortProgramHoursJune,
        shortProgramHoursJuly,
        shortProgramHoursAugust,
        shortProgramHoursSeptember,
        shortProgramHoursOctober,
        shortProgramHoursNovember,
        shortProgramHoursDecember,
        certificationProgramHoursJanuary,
        certificationProgramHoursFebruary,
        certificationProgramHoursMarch,
        certificationProgramHoursApril,
        certificationProgramHoursMay,
        certificationProgramHoursJune,
        certificationProgramHoursJuly,
        certificationProgramHoursAugust,
        certificationProgramHoursSeptember,
        certificationProgramHoursOctober,
        certificationProgramHoursNovember,
        certificationProgramHoursDecember,
        inCompanyAssessmentHoursJanuary,
        inCompanyAssessmentHoursFebruary,
        inCompanyAssessmentHoursMarch,
        inCompanyAssessmentHoursApril,
        inCompanyAssessmentHoursMay,
        inCompanyAssessmentHoursJune,
        inCompanyAssessmentHoursJuly,
        inCompanyAssessmentHoursAugust,
        inCompanyAssessmentHoursSeptember,
        inCompanyAssessmentHoursOctober,
        inCompanyAssessmentHoursNovember,
        inCompanyAssessmentHoursDecember,
        corporateProgramHoursJanuary,
        corporateProgramHoursFebruary,
        corporateProgramHoursMarch,
        corporateProgramHoursApril,
        corporateProgramHoursMay,
        corporateProgramHoursJune,
        corporateProgramHoursJuly,
        corporateProgramHoursAugust,
        corporateProgramHoursSeptember,
        corporateProgramHoursOctober,
        corporateProgramHoursNovember,
        corporateProgramHoursDecember,
        ictHoursJanuary,
        ictHoursFebruary,
        ictHoursMarch,
        ictHoursApril,
        ictHoursMay,
        ictHoursJune,
        ictHoursJuly,
        ictHoursAugust,
        ictHoursSeptember,
        ictHoursOctober,
        ictHoursNovember,
        ictHoursDecember,
        consultationProgramHoursJanuary,
        consultationProgramHoursFebruary,
        consultationProgramHoursMarch,
        consultationProgramHoursApril,
        consultationProgramHoursMay,
        consultationProgramHoursJune,
        consultationProgramHoursJuly,
        consultationProgramHoursAugust,
        consultationProgramHoursSeptember,
        consultationProgramHoursOctober,
        consultationProgramHoursNovember,
        consultationProgramHoursDecember,
        assessmentProgramHoursJanuary,
        assessmentProgramHoursFebruary,
        assessmentProgramHoursMarch,
        assessmentProgramHoursApril,
        assessmentProgramHoursMay,
        assessmentProgramHoursJune,
        assessmentProgramHoursJuly,
        assessmentProgramHoursAugust,
        assessmentProgramHoursSeptember,
        assessmentProgramHoursOctober,
        assessmentProgramHoursNovember,
        assessmentProgramHoursDecember,
      }
    })
  } catch (err) {
    next(err)
  }
}