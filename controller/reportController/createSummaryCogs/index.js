const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')
const writeXlsxFile = require('write-excel-file/node')
const fs = require('fs')

const countingHours = ({ schedules }) => {
  let totalHours = 0

  schedules.forEach(scheduleItem => {
    let duration = (Number(scheduleItem.endHours) - Number(scheduleItem.startHours)) / 1000 / 3600
    totalHours += duration
  })

  return totalHours
}

const handleGetMonth = ({ fulldateInput }) => {
  const fulldate = new Date(fulldateInput)
  const month = fulldate.getMonth()
  let result = null
  if (month == 0) {
    result = 'January'
  } else if (month == 1) {
    result = 'February'
  } else if (month == 2) {
    result = 'March'
  } else if (month == 3) {
    result = 'April'
  } else if (month == 4) {
    result = 'May'
  } else if (month == 5) {
    result = 'June'
  } else if (month == 6) {
    result = 'July'
  } else if (month == 7) {
    result = 'August'
  } else if (month == 8) {
    result = 'September'
  } else if (month == 9) {
    result = 'October'
  } else if (month == 10) {
    result = 'November'
  } else if (month == 11) {
    result = 'December'
  }

  return result
}

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { year, month, group, profitCenter, wbsCode } = req.body
    if (!month || !year) throw { code: '400', errors: ['year and month are required'] }
    let startWbsPeriod = new Date(Number(year), Number(month), 1)
    let endWbsPeriod = new Date(Number(year), Number(month) + 1, 0)
    startWbsPeriod.setHours(0, 0, 0, 0)
    endWbsPeriod.setHours(23, 59, 0, 0)

    const findPlot = await Plot.findAll({
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
          attributes: ['id', 'PlotId', 'startHours', 'endHours'],
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

    // Create excel
    const filename = `summary-cogs-${randomString({ length: 5 })}.xlsx`
    const headerExcel = [
      {
        value: 'Profit Center',
        fontWeight: 'bold'
      },
      {
        value: 'Learning Periode',
        fontWeight: 'bold'
      },
      {
        value: 'Company',
        fontWeight: 'bold'
      },
      {
        value: 'WBS Name',
        fontWeight: 'bold'
      },
      {
        value: 'No Project ID',
        fontWeight: 'bold'
      },
      {
        value: 'APM',
        fontWeight: 'bold'
      },
      {
        value: 'Hours',
        fontWeight: 'bold'
      },
      {
        value: 'SAP ID',
        fontWeight: 'bold'
      },
      {
        value: 'Sales',
        fontWeight: 'bold'
      },
    ]

    const dataExcel = findPlot?.map(findPlotItem => {
      return [
        {
          type: String,
          value: findPlotItem.programCategory,
        },
        {
          type: String,
          value: handleGetMonth({
            fulldateInput: new Date(Number(year), Number(month), 1)
          }),
        },
        {
          type: String,
          value: findPlotItem.client,
        },
        {
          type: String,
          value: findPlotItem.name,
        },
        {
          type: String,
          value: findPlotItem.wbs,
        },
        {
          type: String,
          value: findPlotItem.group
        },
        {
          type: Number,
          value: countingHours({ schedules: findPlotItem.Schedules })
        },
        {
          type: String,
          value: findPlotItem.sapId
        },
        {
          type: Number,
          value: findPlotItem.sales
        }
      ]
    })

    await writeXlsxFile([headerExcel, ...dataExcel], {
      filePath: `assets/${filename}`,
      sheet: `${handleGetMonth({ fulldateInput: new Date(Number(year), Number(month), 1) })} ${year}`
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