const { Schedule, Plot, PlotSapProjectId, ClassType, ActivityType } = require('../../../models')
const { Op, where } = require('sequelize')
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
    const { startHours, endHours, group, profitCenter, isSyncSap, isGcalSync } = req.query
    if (!startHours || !endHours) throw { code: '400', errors: ['start hours and end hours are required'] }
    let startHours_ = new Date(Number(startHours))
    let endHours_ = new Date(Number(endHours))
    startHours_.setHours(0, 0, 0, 0)
    endHours_.setHours(23, 59, 0, 0)

    const findActivityTypes = await ActivityType.findAll({
      where: {
        apiName: {
          [Op.or]: ['learning', 'meeting']
        }
      },
      attributes: ['id', 'apiName'],
    })

    const findSchedules = await Schedule.findAll({
      attributes: ['id', 'PlotId', 'startHours', 'endHours', 'breakDuration', 'ClassTypeId', 'gcalEventId', 'isCanceled', 'isDeleted'],
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
        ActivityTypeId: {
          [Op.or]: findActivityTypes.map(item => item.id)
        }
      },
      include: [
        {
          model: Plot,
          attributes: ['id', 'group', 'sapId', 'profitCenter'],
          where: {
            group: {
              [Op.like]: `%${group || ''}%`
            },
            sapId: handleSapIdFilter(isSyncSap)
          },
          required: true
        },
        {
          model: ClassType,
          attributes: ['id', 'apiName'],
          required: true
        },
      ]
    })

    // APM P
    let apmPOnsite = 0
    let apmPOnsiteShortProgram = 0
    let apmPOnsiteCertificationProgram = 0
    let apmPOnsiteICT = 0
    let apmPOnsiteICA = 0
    let apmPOnsiteCorporateProgram = 0
    let apmPOnsiteConsultingProgram = 0
    let apmPOnsiteAssessmentProgram = 0

    let apmPOnsiteCilandak = 0
    let apmPOnsiteCilandakShortProgram = 0
    let apmPOnsiteCilandakCertificationProgram = 0
    let apmPOnsiteCilandakICT = 0
    let apmPOnsiteCilandakICA = 0
    let apmPOnsiteCilandakCorporateProgram = 0
    let apmPOnsiteCilandakConsultingProgram = 0
    let apmPOnsiteCilandakAssessmentProgram = 0

    let apmPOnline = 0
    let apmPOnlineShortProgram = 0
    let apmPOnlineCertificationProgram = 0
    let apmPOnlineICT = 0
    let apmPOnlineICA = 0
    let apmPOnlineCorporateProgram = 0
    let apmPOnlineConsultingProgram = 0
    let apmPOnlineAssessmentProgram = 0

    // APM C1
    let apmC1Onsite = 0
    let apmC1OnsiteCorporateProgram = 0
    let apmC1OnsiteConsultingProgram = 0
    let apmC1OnsiteAssessmentProgram = 0
    let apmC1OnsiteShortProgram = 0
    let apmC1OnsiteCertificationProgram = 0
    let apmC1OnsiteICT = 0
    let apmC1OnsiteICA = 0

    let apmC1OnsiteCilandak = 0
    let apmC1OnsiteCilandakCorporateProgram = 0
    let apmC1OnsiteCilandakConsultingProgram = 0
    let apmC1OnsiteCilandakAssessmentProgram = 0
    let apmC1OnsiteCilandakShortProgram = 0
    let apmC1OnsiteCilandakCertificationProgram = 0
    let apmC1OnsiteCilandakICT = 0
    let apmC1OnsiteCilandakICA = 0

    let apmC1Online = 0
    let apmC1OnlineCorporateProgram = 0
    let apmC1OnlineConsultingProgram = 0
    let apmC1OnlineAssessmentProgram = 0
    let apmC1OnlineShortProgram = 0
    let apmC1OnlineCertificationProgram = 0
    let apmC1OnlineICT = 0
    let apmC1OnlineICA = 0

    // APM C2
    let apmC2Onsite = 0
    let apmC2OnsiteCorporateProgram = 0
    let apmC2OnsiteConsultingProgram = 0
    let apmC2OnsiteAssessmentProgram = 0
    let apmC2OnsiteShortProgram = 0
    let apmC2OnsiteCertificationProgram = 0
    let apmC2OnsiteICT = 0
    let apmC2OnsiteICA = 0

    let apmC2OnsiteCilandak = 0
    let apmC2OnsiteCilandakCorporateProgram = 0
    let apmC2OnsiteCilandakConsultingProgram = 0
    let apmC2OnsiteCilandakAssessmentProgram = 0
    let apmC2OnsiteCilandakShortProgram = 0
    let apmC2OnsiteCilandakCertificationProgram = 0
    let apmC2OnsiteCilandakICT = 0
    let apmC2OnsiteCilandakICA = 0

    let apmC2Online = 0
    let apmC2OnlineCorporateProgram = 0
    let apmC2OnlineConsultingProgram = 0
    let apmC2OnlineAssessmentProgram = 0
    let apmC2OnlineShortProgram = 0
    let apmC2OnlineCertificationProgram = 0
    let apmC2OnlineICT = 0
    let apmC2OnlineICA = 0

    findSchedules.forEach(scheduleItem => {
      let breakDuration = scheduleItem.dataValues.breakDuration !== null ? scheduleItem.dataValues.breakDuration : 0
      let duration = scheduleItem.dataValues.endHours - scheduleItem.dataValues.startHours - breakDuration
      if (scheduleItem.dataValues.Plot.group === 'APM P' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmPOnsite += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmPOnsiteShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmPOnsiteCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmPOnsiteICA += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmPOnsiteICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmPOnsiteCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmPOnsiteConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmPOnsiteAssessmentProgram += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM P' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmPOnsiteCilandak += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmPOnsiteCilandakShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmPOnsiteCilandakCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmPOnsiteCilandakICA += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmPOnsiteCilandakICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmPOnsiteCilandakCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmPOnsiteCilandakConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmPOnsiteCilandakAssessmentProgram += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM P' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmPOnline += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmPOnlineShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmPOnlineCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmPOnlineICA += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmPOnlineICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmPOnlineCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmPOnlineConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmPOnlineAssessmentProgram += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM C1' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmC1Onsite += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmC1OnsiteCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmC1OnsiteConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmC1OnsiteAssessmentProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmC1OnsiteShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmC1OnsiteCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmC1OnsiteICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmC1OnsiteICA += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM C1' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmC1OnsiteCilandak += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmC1OnsiteCilandakCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmC1OnsiteCilandakConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmC1OnsiteCilandakAssessmentProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmC1OnsiteCilandakShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmC1OnsiteCilandakCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmC1OnsiteCilandakICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmC1OnsiteCilandakICA += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM C1' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmC1Online += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmC1OnlineCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmC1OnlineConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmC1OnlineAssessmentProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmC1OnlineShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmC1OnlineCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmC1OnlineICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmC1OnlineICA += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM C2' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmC2Onsite += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmC2OnsiteCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmC2OnsiteConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmC2OnsiteAssessmentProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmC2OnsiteShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmC2OnsiteCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmC2OnsiteICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmC2OnsiteICA += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM C2' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmC2OnsiteCilandak += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmC2OnsiteCilandakCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmC2OnsiteCilandakConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmC2OnsiteCilandakAssessmentProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmC2OnsiteCilandakShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmC2OnsiteCilandakCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmC2OnsiteCilandakICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmC2OnsiteCilandakICA += duration
        }
      } else if (scheduleItem.dataValues.Plot.group === 'APM C2' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        if (scheduleItem.dataValues.Plot.profitCenter) {
          apmC2Online += duration
        }
        if (scheduleItem.dataValues.Plot.profitCenter === '0000032201') {
          apmC2OnlineCorporateProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203') {
          apmC2OnlineConsultingProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204') {
          apmC2OnlineAssessmentProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101') {
          apmC2OnlineShortProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102') {
          apmC2OnlineCertificationProgram += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105') {
          apmC2OnlineICT += duration
        } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104') {
          apmC2OnlineICA += duration
        }
      }
    })

    const totalData = apmPOnsite + apmPOnsiteCilandak + apmPOnline + apmC1Onsite + apmC1OnsiteCilandak + apmC1Online + apmC2Onsite + apmC2OnsiteCilandak + apmC2Online
    const totalDataApmP = apmPOnsite + apmPOnsiteCilandak + apmPOnline
    const totalDataApmC1 = apmC1Onsite + apmC1OnsiteCilandak + apmC1Online
    const totalDataApmC2 = apmC2Onsite + apmC2OnsiteCilandak + apmC2Online

    // APM P
    let resultApmPOnsite = totalData > 0 ? ((apmPOnsite / totalData) * 100) : 0
    let resultApmPOnsiteHours = totalData > 0 ? (apmPOnsite / 1000 / 3600) : 0
    let resultApmPOnsiteShortProgram = totalDataApmP > 0 ? ((apmPOnsiteShortProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteShortProgramHours = totalDataApmP > 0 ? (apmPOnsiteShortProgram / 1000 / 3600) : 0
    let resultApmPOnsiteCertificationProgram = totalDataApmP > 0 ? ((apmPOnsiteCertificationProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCertificationProgramHours = totalDataApmP > 0 ? (apmPOnsiteCertificationProgram / 1000 / 3600) : 0
    let resultApmPOnsiteICT = totalDataApmP > 0 ? ((apmPOnsiteICT / totalDataApmP) * 100) : 0
    let resultApmPOnsiteICTHours = totalDataApmP > 0 ? (apmPOnsiteICT / 1000 / 3600) : 0
    let resultApmPOnsiteICA = totalDataApmP > 0 ? ((apmPOnsiteICA / totalDataApmP) * 100) : 0
    let resultApmPOnsiteICAHours = totalDataApmP > 0 ? (apmPOnsiteICA / 1000 / 3600) : 0
    let resultApmPOnsiteCorporateProgram = totalDataApmP > 0 ? ((apmPOnsiteCorporateProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCorporateProgramHours = totalDataApmP > 0 ? (apmPOnsiteCorporateProgram / 1000 / 3600) : 0
    let resultApmPOnsiteConsultingProgram = totalDataApmP > 0 ? ((apmPOnsiteConsultingProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteConsultingProgramHours = totalDataApmP > 0 ? (apmPOnsiteConsultingProgram / 1000 / 3600) : 0
    let resultApmPOnsiteAssessmentProgram = totalDataApmP > 0 ? ((apmPOnsiteAssessmentProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteAssessmentProgramHours = totalDataApmP > 0 ? (apmPOnsiteAssessmentProgram / 1000 / 3600) : 0

    let resultApmPOnsiteCilandak = totalData > 0 ? ((apmPOnsiteCilandak / totalData) * 100) : 0
    let resultApmPOnsiteCilandakHours = totalData > 0 ? (apmPOnsiteCilandak / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakShortProgram = totalDataApmP > 0 ? ((apmPOnsiteCilandakShortProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakShortProgramHours = totalDataApmP > 0 ? (apmPOnsiteCilandakShortProgram / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakCertificationProgram = totalDataApmP > 0 ? ((apmPOnsiteCilandakCertificationProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakCertificationProgramHours = totalDataApmP > 0 ? (apmPOnsiteCilandakCertificationProgram / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakICT = totalDataApmP > 0 ? ((apmPOnsiteCilandakICT / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakICTHours = totalDataApmP > 0 ? (apmPOnsiteCilandakICT / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakICA = totalDataApmP > 0 ? ((apmPOnsiteCilandakICA / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakICAHours = totalDataApmP > 0 ? (apmPOnsiteCilandakICA / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakCorporateProgram = totalDataApmP > 0 ? ((apmPOnsiteCilandakCorporateProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakCorporateProgramHours = totalDataApmP > 0 ? (apmPOnsiteCilandakCorporateProgram / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakConsultingProgram = totalDataApmP > 0 ? ((apmPOnsiteCilandakConsultingProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakConsultingProgramHours = totalDataApmP > 0 ? (apmPOnsiteCilandakConsultingProgram / 1000 / 3600) : 0
    let resultApmPOnsiteCilandakAssessmentProgram = totalDataApmP > 0 ? ((apmPOnsiteCilandakAssessmentProgram / totalDataApmP) * 100) : 0
    let resultApmPOnsiteCilandakAssessmentProgramHours = totalDataApmP > 0 ? (apmPOnsiteCilandakAssessmentProgram / 1000 / 3600) : 0

    let resultApmPOnline = totalData > 0 ? ((apmPOnline / totalData) * 100) : 0
    let resultApmPOnlineHours = totalData > 0 ? (apmPOnline / 1000 / 3600) : 0
    let resultApmPOnlineShortProgram = totalDataApmP > 0 ? ((apmPOnlineShortProgram / totalDataApmP) * 100) : 0
    let resultApmPOnlineShortProgramHours = totalDataApmP > 0 ? (apmPOnlineShortProgram / 1000 / 3600) : 0
    let resultApmPOnlineCertificationProgram = totalDataApmP > 0 ? ((apmPOnlineCertificationProgram / totalDataApmP) * 100) : 0
    let resultApmPOnlineCertificationProgramHours = totalDataApmP > 0 ? (apmPOnlineCertificationProgram / 1000 / 3600) : 0
    let resultApmPOnlineICT = totalDataApmP > 0 ? ((apmPOnlineICT / totalDataApmP) * 100) : 0
    let resultApmPOnlineICTHours = totalDataApmP > 0 ? (apmPOnlineICT / 1000 / 3600) : 0
    let resultApmPOnlineICA = totalDataApmP > 0 ? ((apmPOnlineICA / totalDataApmP) * 100) : 0
    let resultApmPOnlineICAHours = totalDataApmP > 0 ? (apmPOnlineICA / 1000 / 3600) : 0
    let resultApmPOnlineCorporateProgram = totalDataApmP > 0 ? ((apmPOnlineCorporateProgram / totalDataApmP) * 100) : 0
    let resultApmPOnlineCorporateProgramHours = totalDataApmP > 0 ? (apmPOnlineCorporateProgram / 1000 / 3600) : 0
    let resultApmPOnlineConsultingProgram = totalDataApmP > 0 ? ((apmPOnlineConsultingProgram / totalDataApmP) * 100) : 0
    let resultApmPOnlineConsultingProgramHours = totalDataApmP > 0 ? (apmPOnlineConsultingProgram / 1000 / 3600) : 0
    let resultApmPOnlineAssessmentProgram = totalDataApmP > 0 ? ((apmPOnlineAssessmentProgram / totalDataApmP) * 100) : 0
    let resultApmPOnlineAssessmentProgramHours = totalDataApmP > 0 ? (apmPOnlineAssessmentProgram / 1000 / 3600) : 0

    let resultApmPTotal = totalData > 0 ? (resultApmPOnsiteHours + resultApmPOnsiteCilandakHours + resultApmPOnlineHours) : 0

    // APM C1
    let resultApmC1Onsite = totalData > 0 ? ((apmC1Onsite / totalData) * 100) : 0
    let resultApmC1OnsiteHours = totalData > 0 ? (apmC1Onsite / 1000 / 3600) : 0
    let resultApmC1OnsiteShortProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteShortProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteShortProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteShortProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteCertificationProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCertificationProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCertificationProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCertificationProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteICT = totalDataApmC1 > 0 ? ((apmC1OnsiteICT / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteICTHours = totalDataApmC1 > 0 ? (apmC1OnsiteICT / 1000 / 3600) : 0
    let resultApmC1OnsiteICA = totalDataApmC1 > 0 ? ((apmC1OnsiteICA / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteICAHours = totalDataApmC1 > 0 ? (apmC1OnsiteICA / 1000 / 3600) : 0
    let resultApmC1OnsiteCorporateProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCorporateProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCorporateProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCorporateProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteConsultingProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteConsultingProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteConsultingProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteConsultingProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteAssessmentProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteAssessmentProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteAssessmentProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteAssessmentProgram / 1000 / 3600) : 0

    let resultApmC1OnsiteCilandak = totalData > 0 ? ((apmC1OnsiteCilandak / totalData) * 100) : 0
    let resultApmC1OnsiteCilandakHours = totalData > 0 ? (apmC1OnsiteCilandak / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakShortProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakShortProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakShortProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakShortProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakCertificationProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakCertificationProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakCertificationProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakCertificationProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakICT = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakICT / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakICTHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakICT / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakICA = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakICA / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakICAHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakICA / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakCorporateProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakCorporateProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakCorporateProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakCorporateProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakConsultingProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakConsultingProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakConsultingProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakConsultingProgram / 1000 / 3600) : 0
    let resultApmC1OnsiteCilandakAssessmentProgram = totalDataApmC1 > 0 ? ((apmC1OnsiteCilandakAssessmentProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnsiteCilandakAssessmentProgramHours = totalDataApmC1 > 0 ? (apmC1OnsiteCilandakAssessmentProgram / 1000 / 3600) : 0

    let resultApmC1Online = totalData > 0 ? ((apmC1Online / totalData) * 100) : 0
    let resultApmC1OnlineHours = totalData > 0 ? (apmC1Online / 1000 / 3600) : 0
    let resultApmC1OnlineShortProgram = totalDataApmC1 > 0 ? ((apmC1OnlineShortProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineShortProgramHours = totalDataApmC1 > 0 ? (apmC1OnlineShortProgram / 1000 / 3600) : 0
    let resultApmC1OnlineCertificationProgram = totalDataApmC1 > 0 ? ((apmC1OnlineCertificationProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineCertificationProgramHours = totalDataApmC1 > 0 ? (apmC1OnlineCertificationProgram / 1000 / 3600) : 0
    let resultApmC1OnlineICT = totalDataApmC1 > 0 ? ((apmC1OnlineICT / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineICTHours = totalDataApmC1 > 0 ? (apmC1OnlineICT / 1000 / 3600) : 0
    let resultApmC1OnlineICA = totalDataApmC1 > 0 ? ((apmC1OnlineICA / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineICAHours = totalDataApmC1 > 0 ? (apmC1OnlineICA / 1000 / 3600) : 0
    let resultApmC1OnlineCorporateProgram = totalDataApmC1 > 0 ? ((apmC1OnlineCorporateProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineCorporateProgramHours = totalDataApmC1 > 0 ? (apmC1OnlineCorporateProgram / 1000 / 3600) : 0
    let resultApmC1OnlineConsultingProgram = totalDataApmC1 > 0 ? ((apmC1OnlineConsultingProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineConsultingProgramHours = totalDataApmC1 > 0 ? (apmC1OnlineConsultingProgram / 1000 / 3600) : 0
    let resultApmC1OnlineAssessmentProgram = totalDataApmC1 > 0 ? ((apmC1OnlineAssessmentProgram / totalDataApmC1) * 100) : 0
    let resultApmC1OnlineAssessmentProgramHours = totalDataApmC1 > 0 ? (apmC1OnlineAssessmentProgram / 1000 / 3600) : 0

    let resultApmC1Total = totalData > 0 ? (resultApmC1OnsiteHours + resultApmC1OnsiteCilandakHours + resultApmC1OnlineHours) : 0


    // APM C2
    let resultApmC2Onsite = totalData > 0 ? ((apmC2Onsite / totalData) * 100) : 0
    let resultApmC2OnsiteHours = totalData > 0 ? (apmC2Onsite / 1000 / 3600) : 0
    let resultApmC2OnsiteShortProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteShortProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteShortProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteShortProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteCertificationProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCertificationProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCertificationProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCertificationProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteICT = totalDataApmC2 > 0 ? ((apmC2OnsiteICT / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteICTHours = totalDataApmC2 > 0 ? (apmC2OnsiteICT / 1000 / 3600) : 0
    let resultApmC2OnsiteICA = totalDataApmC2 > 0 ? ((apmC2OnsiteICA / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteICAHours = totalDataApmC2 > 0 ? (apmC2OnsiteICA / 1000 / 3600) : 0
    let resultApmC2OnsiteCorporateProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCorporateProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCorporateProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCorporateProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteConsultingProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteConsultingProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteConsultingProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteConsultingProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteAssessmentProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteAssessmentProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteAssessmentProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteAssessmentProgram / 1000 / 3600) : 0

    let resultApmC2OnsiteCilandak = totalData > 0 ? ((apmC2OnsiteCilandak / totalData) * 100) : 0
    let resultApmC2OnsiteCilandakHours = totalData > 0 ? (apmC2OnsiteCilandak / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakShortProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakShortProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakShortProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakShortProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakCertificationProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakCertificationProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakCertificationProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakCertificationProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakICT = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakICT / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakICTHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakICT / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakICA = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakICA / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakICAHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakICA / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakCorporateProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakCorporateProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakCorporateProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakCorporateProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakConsultingProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakConsultingProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakConsultingProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakConsultingProgram / 1000 / 3600) : 0
    let resultApmC2OnsiteCilandakAssessmentProgram = totalDataApmC2 > 0 ? ((apmC2OnsiteCilandakAssessmentProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnsiteCilandakAssessmentProgramHours = totalDataApmC2 > 0 ? (apmC2OnsiteCilandakAssessmentProgram / 1000 / 3600) : 0

    let resultApmC2Online = totalData > 0 ? ((apmC2Online / totalData) * 100) : 0
    let resultApmC2OnlineHours = totalData > 0 ? (apmC2Online / 1000 / 3600) : 0
    let resultApmC2OnlineShortProgram = totalDataApmC2 > 0 ? ((apmC2OnlineShortProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineShortProgramHours = totalDataApmC2 > 0 ? (apmC2OnlineShortProgram / 1000 / 3600) : 0
    let resultApmC2OnlineCertificationProgram = totalDataApmC2 > 0 ? ((apmC2OnlineCertificationProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineCertificationProgramHours = totalDataApmC2 > 0 ? (apmC2OnlineCertificationProgram / 1000 / 3600) : 0
    let resultApmC2OnlineICT = totalDataApmC2 > 0 ? ((apmC2OnlineICT / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineICTHours = totalDataApmC2 > 0 ? (apmC2OnlineICT / 1000 / 3600) : 0
    let resultApmC2OnlineICA = totalDataApmC2 > 0 ? ((apmC2OnlineICA / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineICAHours = totalDataApmC2 > 0 ? (apmC2OnlineICA / 1000 / 3600) : 0
    let resultApmC2OnlineCorporateProgram = totalDataApmC2 > 0 ? ((apmC2OnlineCorporateProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineCorporateProgramHours = totalDataApmC2 > 0 ? (apmC2OnlineCorporateProgram / 1000 / 3600) : 0
    let resultApmC2OnlineConsultingProgram = totalDataApmC2 > 0 ? ((apmC2OnlineConsultingProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineConsultingProgramHours = totalDataApmC2 > 0 ? (apmC2OnlineConsultingProgram / 1000 / 3600) : 0
    let resultApmC2OnlineAssessmentProgram = totalDataApmC2 > 0 ? ((apmC2OnlineAssessmentProgram / totalDataApmC2) * 100) : 0
    let resultApmC2OnlineAssessmentProgramHours = totalDataApmC2 > 0 ? (apmC2OnlineAssessmentProgram / 1000 / 3600) : 0

    let resultApmC2Total = totalData > 0 ? (resultApmC2OnsiteHours + resultApmC2OnsiteCilandakHours + resultApmC2OnlineHours) : 0

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        apmPOnsite: resultApmPOnsite,
        apmPOnsiteHours: resultApmPOnsiteHours,
        apmPOnsiteShortProgram: resultApmPOnsiteShortProgram,
        apmPOnsiteShortProgramHours: resultApmPOnsiteShortProgramHours,
        apmPOnsiteCertificationProgram: resultApmPOnsiteCertificationProgram,
        apmPOnsiteCertificationProgramHours: resultApmPOnsiteCertificationProgramHours,
        apmPOnsiteICT: resultApmPOnsiteICT,
        apmPOnsiteICTHours: resultApmPOnsiteICTHours,
        apmPOnsiteICA: resultApmPOnsiteICA,
        apmPOnsiteICAHours: resultApmPOnsiteICAHours,
        apmPOnsiteCorporateProgram: resultApmPOnsiteCorporateProgram,
        apmPOnsiteCorporateProgramHours: resultApmPOnsiteCorporateProgramHours,
        apmPOnsiteConsultingProgram: resultApmPOnsiteConsultingProgram,
        apmPOnsiteConsultingProgramHours: resultApmPOnsiteConsultingProgramHours,
        apmPOnsiteAssessmentProgram: resultApmPOnsiteAssessmentProgram,
        apmPOnsiteAssessmentProgramHours: resultApmPOnsiteAssessmentProgramHours,
        apmPOnsiteCilandak: resultApmPOnsiteCilandak,
        apmPOnsiteCilandakHours: resultApmPOnsiteCilandakHours,
        apmPOnsiteCilandakShortProgram: resultApmPOnsiteCilandakShortProgram,
        apmPOnsiteCilandakShortProgramHours: resultApmPOnsiteCilandakShortProgramHours,
        apmPOnsiteCilandakCertificationProgram: resultApmPOnsiteCilandakCertificationProgram,
        apmPOnsiteCilandakCertificationProgramHours: resultApmPOnsiteCilandakCertificationProgramHours,
        apmPOnsiteCilandakICT: resultApmPOnsiteCilandakICT,
        apmPOnsiteCilandakICTHours: resultApmPOnsiteCilandakICTHours,
        apmPOnsiteCilandakICA: resultApmPOnsiteCilandakICA,
        apmPOnsiteCilandakICAHours: resultApmPOnsiteCilandakICAHours,
        apmPOnsiteCilandakCorporateProgram: resultApmPOnsiteCilandakCorporateProgram,
        apmPOnsiteCilandakCorporateProgramHours: resultApmPOnsiteCilandakCorporateProgramHours,
        apmPOnsiteCilandakConsultingProgram: resultApmPOnsiteCilandakConsultingProgram,
        apmPOnsiteCilandakConsultingProgram: resultApmPOnsiteCilandakConsultingProgram,
        apmPOnsiteCilandakAssessmentProgramHours: resultApmPOnsiteCilandakAssessmentProgramHours,
        apmPOnline: resultApmPOnline,
        apmPOnlineHours: resultApmPOnlineHours,
        apmPOnlineShortProgram: resultApmPOnlineShortProgram,
        apmPOnlineShortProgramHours: resultApmPOnlineShortProgramHours,
        apmPOnlineCertificationProgram: resultApmPOnlineCertificationProgram,
        apmPOnlineCertificationProgramHours: resultApmPOnlineCertificationProgramHours,
        apmPOnlineICT: resultApmPOnlineICT,
        apmPOnlineICTHours: resultApmPOnlineICTHours,
        apmPOnlineICA: resultApmPOnlineICA,
        apmPOnlineICAHours: resultApmPOnlineICAHours,
        apmPOnlineCorporateProgram: resultApmPOnlineCorporateProgram,
        apmPOnlineCorporateProgramHours: resultApmPOnlineCorporateProgramHours,
        apmPOnlineConsultingProgram: resultApmPOnlineConsultingProgram,
        apmPOnlineConsultingProgramHours: resultApmPOnlineConsultingProgramHours,
        apmPOnlineAssessmentProgram: resultApmPOnlineAssessmentProgram,
        apmPOnlineAssessmentProgramHours: resultApmPOnlineAssessmentProgramHours,
        apmPTotal: resultApmPTotal,

        apmC1Onsite: resultApmC1Onsite,
        apmC1OnsiteHours: resultApmC1OnsiteHours,
        apmC1OnsiteShortProgram: resultApmC1OnsiteShortProgram,
        apmC1OnsiteShortProgramHours: resultApmC1OnsiteShortProgramHours,
        apmC1OnsiteCertificationProgram: resultApmC1OnsiteCertificationProgram,
        apmC1OnsiteCertificationProgramHours: resultApmC1OnsiteCertificationProgramHours,
        apmC1OnsiteICT: resultApmC1OnsiteICT,
        apmC1OnsiteICTHours: resultApmC1OnsiteICTHours,
        apmC1OnsiteICA: resultApmC1OnsiteICA,
        apmC1OnsiteICAHours: resultApmC1OnsiteICAHours,
        apmC1OnsiteCorporateProgram: resultApmC1OnsiteCorporateProgram,
        apmC1OnsiteCorporateProgramHours: resultApmC1OnsiteCorporateProgramHours,
        apmC1OnsiteConsultingProgram: resultApmC1OnsiteConsultingProgram,
        apmC1OnsiteConsultingProgramHours: resultApmC1OnsiteConsultingProgramHours,
        apmC1OnsiteAssessmentProgram: resultApmC1OnsiteAssessmentProgram,
        apmC1OnsiteAssessmentProgramHours: resultApmC1OnsiteAssessmentProgramHours,
        apmC1OnsiteCilandak: resultApmC1OnsiteCilandak,
        apmC1OnsiteCilandakHours: resultApmC1OnsiteCilandakHours,
        apmC1OnsiteCilandakShortProgram: resultApmC1OnsiteCilandakShortProgram,
        apmC1OnsiteCilandakShortProgramHours: resultApmC1OnsiteCilandakShortProgramHours,
        apmC1OnsiteCilandakCertificationProgram: resultApmC1OnsiteCilandakCertificationProgram,
        apmC1OnsiteCilandakCertificationProgramHours: resultApmC1OnsiteCilandakCertificationProgramHours,
        apmC1OnsiteCilandakICT: resultApmC1OnsiteCilandakICT,
        apmC1OnsiteCilandakICTHours: resultApmC1OnsiteCilandakICTHours,
        apmC1OnsiteCilandakICA: resultApmC1OnsiteCilandakICA,
        apmC1OnsiteCilandakICAHours: resultApmC1OnsiteCilandakICAHours,
        apmC1OnsiteCilandakCorporateProgram: resultApmC1OnsiteCilandakCorporateProgram,
        apmC1OnsiteCilandakCorporateProgramHours: resultApmC1OnsiteCilandakCorporateProgramHours,
        apmC1OnsiteCilandakConsultingProgram: resultApmC1OnsiteCilandakConsultingProgram,
        apmC1OnsiteCilandakConsultingProgram: resultApmC1OnsiteCilandakConsultingProgram,
        apmC1OnsiteCilandakAssessmentProgramHours: resultApmC1OnsiteCilandakAssessmentProgramHours,
        apmC1Online: resultApmC1Online,
        apmC1OnlineHours: resultApmC1OnlineHours,
        apmC1OnlineShortProgram: resultApmC1OnlineShortProgram,
        apmC1OnlineShortProgramHours: resultApmC1OnlineShortProgramHours,
        apmC1OnlineCertificationProgram: resultApmC1OnlineCertificationProgram,
        apmC1OnlineCertificationProgramHours: resultApmC1OnlineCertificationProgramHours,
        apmC1OnlineICT: resultApmC1OnlineICT,
        apmC1OnlineICTHours: resultApmC1OnlineICTHours,
        apmC1OnlineICA: resultApmC1OnlineICA,
        apmC1OnlineICAHours: resultApmC1OnlineICAHours,
        apmC1OnlineCorporateProgram: resultApmC1OnlineCorporateProgram,
        apmC1OnlineCorporateProgramHours: resultApmC1OnlineCorporateProgramHours,
        apmC1OnlineConsultingProgram: resultApmC1OnlineConsultingProgram,
        apmC1OnlineConsultingProgramHours: resultApmC1OnlineConsultingProgramHours,
        apmC1OnlineAssessmentProgram: resultApmC1OnlineAssessmentProgram,
        apmC1OnlineAssessmentProgramHours: resultApmC1OnlineAssessmentProgramHours,
        apmC1Total: resultApmC1Total,

        apmC2Onsite: resultApmC2Onsite,
        apmC2OnsiteHours: resultApmC2OnsiteHours,
        apmC2OnsiteShortProgram: resultApmC2OnsiteShortProgram,
        apmC2OnsiteShortProgramHours: resultApmC2OnsiteShortProgramHours,
        apmC2OnsiteCertificationProgram: resultApmC2OnsiteCertificationProgram,
        apmC2OnsiteCertificationProgramHours: resultApmC2OnsiteCertificationProgramHours,
        apmC2OnsiteICT: resultApmC2OnsiteICT,
        apmC2OnsiteICTHours: resultApmC2OnsiteICTHours,
        apmC2OnsiteICA: resultApmC2OnsiteICA,
        apmC2OnsiteICAHours: resultApmC2OnsiteICAHours,
        apmC2OnsiteCorporateProgram: resultApmC2OnsiteCorporateProgram,
        apmC2OnsiteCorporateProgramHours: resultApmC2OnsiteCorporateProgramHours,
        apmC2OnsiteConsultingProgram: resultApmC2OnsiteConsultingProgram,
        apmC2OnsiteConsultingProgramHours: resultApmC2OnsiteConsultingProgramHours,
        apmC2OnsiteAssessmentProgram: resultApmC2OnsiteAssessmentProgram,
        apmC2OnsiteAssessmentProgramHours: resultApmC2OnsiteAssessmentProgramHours,
        apmC2OnsiteCilandak: resultApmC2OnsiteCilandak,
        apmC2OnsiteCilandakHours: resultApmC2OnsiteCilandakHours,
        apmC2OnsiteCilandakShortProgram: resultApmC2OnsiteCilandakShortProgram,
        apmC2OnsiteCilandakShortProgramHours: resultApmC2OnsiteCilandakShortProgramHours,
        apmC2OnsiteCilandakCertificationProgram: resultApmC2OnsiteCilandakCertificationProgram,
        apmC2OnsiteCilandakCertificationProgramHours: resultApmC2OnsiteCilandakCertificationProgramHours,
        apmC2OnsiteCilandakICT: resultApmC2OnsiteCilandakICT,
        apmC2OnsiteCilandakICTHours: resultApmC2OnsiteCilandakICTHours,
        apmC2OnsiteCilandakICA: resultApmC2OnsiteCilandakICA,
        apmC2OnsiteCilandakICAHours: resultApmC2OnsiteCilandakICAHours,
        apmC2OnsiteCilandakCorporateProgram: resultApmC2OnsiteCilandakCorporateProgram,
        apmC2OnsiteCilandakCorporateProgramHours: resultApmC2OnsiteCilandakCorporateProgramHours,
        apmC2OnsiteCilandakConsultingProgram: resultApmC2OnsiteCilandakConsultingProgram,
        apmC2OnsiteCilandakConsultingProgram: resultApmC2OnsiteCilandakConsultingProgram,
        apmC2OnsiteCilandakAssessmentProgramHours: resultApmC2OnsiteCilandakAssessmentProgramHours,
        apmC2Online: resultApmC2Online,
        apmC2OnlineHours: resultApmC2OnlineHours,
        apmC2OnlineShortProgram: resultApmC2OnlineShortProgram,
        apmC2OnlineShortProgramHours: resultApmC2OnlineShortProgramHours,
        apmC2OnlineCertificationProgram: resultApmC2OnlineCertificationProgram,
        apmC2OnlineCertificationProgramHours: resultApmC2OnlineCertificationProgramHours,
        apmC2OnlineICT: resultApmC2OnlineICT,
        apmC2OnlineICTHours: resultApmC2OnlineICTHours,
        apmC2OnlineICA: resultApmC2OnlineICA,
        apmC2OnlineICAHours: resultApmC2OnlineICAHours,
        apmC2OnlineCorporateProgram: resultApmC2OnlineCorporateProgram,
        apmC2OnlineCorporateProgramHours: resultApmC2OnlineCorporateProgramHours,
        apmC2OnlineConsultingProgram: resultApmC2OnlineConsultingProgram,
        apmC2OnlineConsultingProgramHours: resultApmC2OnlineConsultingProgramHours,
        apmC2OnlineAssessmentProgram: resultApmC2OnlineAssessmentProgram,
        apmC2OnlineAssessmentProgramHours: resultApmC2OnlineAssessmentProgramHours,
        apmC2Total: resultApmC2Total,

      }
    })
  } catch (err) {
    next(err)
  }
}