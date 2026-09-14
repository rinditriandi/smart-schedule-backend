const { Schedule, Plot, PlotSapProjectId, Consultant, ConsultantSchedule } = require('../../../models')
const { Op } = require('sequelize')
const { randomString, showDate, msToText } = require('../../../helpers')
const writeXlsxFile = require('write-excel-file/node')
const fs = require('fs')

module.exports = async (req, res, next) => {
  try {
    const { startHours, endHours, group, profitCenter, wbsCode, consultantId, isSyncSap } = req.body
    if (!startHours || !endHours) throw { code: '400', errors: ['start hours and end hours are required'] }
    let startHours_ = new Date(Number(startHours))
    let endHours_ = new Date(Number(endHours))
    startHours_.setHours(0, 0, 0, 0)
    endHours_.setHours(23, 59, 0, 0)

    const findSchedules = await Schedule.findAll({
      attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration','totalHours'],
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
      },
      include: [
        {
          model: Plot,
          attributes: ['id', 'name', 'odooWbsId'],
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
              attributes: ['name']
            }
          ],
          required: true
        },
      ]
    })

    // Create excel
    const filename = `odoo-timeline-${randomString({ length: 5 })}.xlsx`
    const headerExcel = [
      {
        value: 'Odoo Project ID',
        fontWeight: 'bold'
      },
      {
        value: 'Date',
        fontWeight: 'bold'
      },
      {
        value: 'Description',
        fontWeight: 'bold'
      },
      {
        value: 'Employee',
        fontWeight: 'bold'
      },
      {
        value: 'Project',
        fontWeight: 'bold'
      },
      {
        value: 'Quantity',
        fontWeight: 'bold'
      },
    ]

    const dataExcel = findSchedules?.map(findScheduleItem => {
      return [
        {
          type: Number,
          value: findScheduleItem?.Plot?.odooWbsId,
        },
        {
          type: String,
          value: new Intl.DateTimeFormat('id', { dateStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(findScheduleItem.startHours)),
        },
        {
          type: String,
          value: "Jam Pengajaran",
        },
        {
          type: String,
          value: findScheduleItem.ConsultantSchedules.map(cs => cs.Consultant.name).join(),
        },
        {
          type: String,
          value: findScheduleItem?.Plot?.name,
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