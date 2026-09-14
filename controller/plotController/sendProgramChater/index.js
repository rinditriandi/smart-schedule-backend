const { Plot, Schedule, Requirement, ClassType } = require('../../../models')
const writeXlsxFile = require('write-excel-file/node')
const { randomString, showDate, sendEmail } = require('../../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params

    const findPlot = await Plot.findByPk(id, {
      order: [[Schedule, 'startHours', 'ASC']],
      include: [
        {
          model: Schedule,
          include: [
            {
              model: Requirement
            },
            {
              model: ClassType
            }
          ]
        }
      ]
    })
    if (!findPlot) throw { code: '404', errors: ['plot not found'] }

    // Create spreadsheet
    const wbsHeader = [
      [
        {
          value: 'Topic',
          fontWeight: 'bold'
        },
        {
          value: findPlot?.topic,
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 'Client',
          fontWeight: 'bold'
        },
        {
          value: findPlot?.client,
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 'PIC of APM',
          fontWeight: 'bold'
        },
        {
          value: findPlot?.group,
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 'Opportunity ID',
          fontWeight: 'bold'
        },
        {
          value: findPlot?.OpportunityId,
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 'WBS Element Level 2',
          fontWeight: 'bold'
        },
        {
          value: findPlot?.wbs,
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 'Status',
          fontWeight: 'bold'
        },
        {
          value: findPlot?.isCanceled ? 'Cancel' : 'Confirmed',
          fontWeight: 'bold'
        }
      ],
      [
        {
          value: 'Print Date',
          fontWeight: 'bold'
        },
        {
          value: showDate({ dateInput: new Date() }),
          fontWeight: 'bold'
        }
      ],
    ]

    const headerDataExcel = [
      [
        {
          value: 'Date',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Start Hours',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'End Hours',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Break Duration',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Status',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Type of Class',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Location',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Description',
          fontWeight: 'bold',
          align: 'center',
        },
        {
          value: 'Requirement',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Requirement Note',
          fontWeight: 'bold',
          align: 'center'
        },
        {
          value: 'Requirement Status',
          fontWeight: 'bold',
          align: 'center'
        },
      ],
    ]

    const dataExcel = []

    findPlot.dataValues.Schedules.forEach(schedule => {
      let rowSpan = schedule.Requirements.length > 1 ? schedule.Requirements.length : undefined
      let requirementLength = schedule.Requirements.length

      if (rowSpan) {
        schedule.Requirements.forEach((requirement, index) => {
          if (index === 0) {
            dataExcel.push([
              {
                type: String,
                value: showDate({ dateInput: schedule.date, isDateOnly: true }),
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: String,
                value: showDate({ dateInput: schedule.startHours, isHoursOnly: true }),
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: String,
                value: showDate({ dateInput: schedule.endHours, isHoursOnly: true }),
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: Number,
                value: schedule?.breakDuration ? Number(schedule?.breakDuration) : 0,
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: String,
                value: schedule?.isCanceled ? 'Cancel' : 'Confirmed',
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: String,
                value: schedule?.ClassType?.label,
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: String,
                value: schedule.location || '-',
                rowSpan,
                alignVertical: 'center'
              },
              {
                type: String,
                value: schedule.description || '-',
                rowSpan,
                alignVertical: 'center',
                wrap: true
              },
              {
                type: String,
                value: `${requirement.label}`,
              },
              {
                type: String,
                value: `${requirement.ScheduleRequirement.note || '-'}`,
              },
              {
                type: String,
                value: `${requirement?.ScheduleRequirement?.isReady == true ? 'Ready' : 'Not Ready'}`,
              },
            ])
          } else {
            dataExcel.push([null, null, null, null, null, null, null, null, { value: `${requirement.label}` }, { value: `${requirement.ScheduleRequirement.note || '-'}` }, { value: `${requirement?.ScheduleRequirement?.isReady == true ? 'Ready' : 'Not Ready'}` }])
          }
        })
      } else {
        if (requirementLength > 0) {
          dataExcel.push([
            {
              type: String,
              value: showDate({ dateInput: schedule.date, isDateOnly: true }),
              alignVertical: 'center'
            },
            {
              type: String,
              value: showDate({ dateInput: schedule.startHours, isHoursOnly: true }),
              alignVertical: 'center'
            },
            {
              type: String,
              value: showDate({ dateInput: schedule.endHours, isHoursOnly: true }),
              alignVertical: 'center'
            },
            {
              type: Number,
              value: schedule?.breakDuration ? Number(schedule?.breakDuration) : 0,
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule?.isCanceled ? 'Cancel' : 'Confirmed',
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule?.ClassType?.label,
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule.location || '-',
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule.description || '-',
              wrap: true,
              alignVertical: 'center'
            },
            {
              type: String,
              value: `${schedule.Requirements[0].label}`,
            },
            {
              type: String,
              value: `${schedule.Requirements[0].ScheduleRequirement.note || '-'}`,
            },
            {
              type: String,
              value: `${schedule.Requirements[0].ScheduleRequirement.isReady == true ? 'Ready' : 'Not Ready'}`,
            },
          ])
        } else {
          dataExcel.push([
            {
              type: String,
              value: showDate({ dateInput: schedule.date, isDateOnly: true }),
              alignVertical: 'center'
            },
            {
              type: String,
              value: showDate({ dateInput: schedule.startHours, isHoursOnly: true }),
              alignVertical: 'center'
            },
            {
              type: String,
              value: showDate({ dateInput: schedule.endHours, isHoursOnly: true }),
              alignVertical: 'center'
            },
            {
              type: Number,
              value: schedule?.breakDuration ? Number(schedule?.breakDuration) : 0,
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule?.isCanceled ? 'Cancel' : 'Confirmed',
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule?.ClassType?.label,
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule.location || '-',
              alignVertical: 'center'
            },
            {
              type: String,
              value: schedule.description || '-',
              wrap: true,
              alignVertical: 'center'
            }
          ])
        }
      }
    })

    const filename = `program-charter-${randomString({ length: 5 })}.xlsx`
    await writeXlsxFile([...wbsHeader, [{ value: null }], ...headerDataExcel, ...dataExcel, [null, null, null, null, null, null, null, null]], {
      filePath: `assets/${filename}`
    })

    const html = `
      <p>Dear Team Support of Prasmul ELI</p>
      <p>There is a Program Charter that has been updated. You can check the program charter on spreadsheet that was attached or by access Schedule System <a href="" target="__blank">here</a>.</p>
      <div>
        <p>WBS Detail </p>
        <div>Topic : ${findPlot.topic}</div>
        <div>Client : ${findPlot.client}</div>
        <div>PIC of APM : ${findPlot.group}</div>
        <div>Opportunity ID : ${findPlot.OpportunityId}</div>
        <div>WBS Element Level 2 : ${findPlot.wbs}</div>
        <div>Status : ${findPlot?.isCanceled ? 'Cancel' : 'Confirmed'}</div>
      </div>
      <br />
      <div>
        <p>You can follow up WBS requirements on <a href="" target="__blank">Schedule System</a> prasmul eli. If you have any questions, please contact the PIC of APM or Team IT prasmul eli.</p>
        <p><b>Please do not reply to this email.</b></p>
      </div>
      <br />
      <div>Schedule System</div>
    `

    sendEmail({
      from: process.env.EMAIL_FROM,
      to: 'support@prasmul-eli.co',
      subject: '[NO-REPLY] Program Charter',
      html,
      attachments: [
        {
          path: `assets/${filename}`
        }
      ],
      deleteFiles: true
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findPlot
    })
  } catch (err) {
    next(err)
  }
}