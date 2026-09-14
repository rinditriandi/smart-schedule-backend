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
          attributes: ['id', 'group', 'profitCenter', 'sapId'],
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

    let shortProgramOnsite = 0
    let shortProgramOnsiteCilandak = 0
    let shortProgramOnline = 0

    let certificationProgramOnsite = 0
    let certificationProgramOnsiteCilandak = 0
    let certificationProgramOnline = 0

    let corporateProgramOnsite = 0
    let corporateProgramOnsiteCilandak = 0
    let corporateProgramOnline = 0

    let ictOnsite = 0
    let ictOnsiteCilandak = 0
    let ictOnline = 0

    let consultationProgramOnsite = 0
    let consultationProgramOnsiteCilandak = 0
    let consultationProgramOnline = 0

    let assessmentProgramOnsite = 0
    let assessmentProgramOnsiteCilandak = 0
    let assessmentProgramOnline = 0

    let icaOnsite = 0
    let icaOnsiteCilandak = 0
    let icaOnline = 0

    findSchedules.forEach(scheduleItem => {
      let breakDuration = scheduleItem.dataValues.breakDuration !== null ? scheduleItem.dataValues.breakDuration : 0
      let duration = scheduleItem.dataValues.endHours - scheduleItem.dataValues.startHours - breakDuration

      if (scheduleItem.dataValues.Plot.profitCenter === '0000032101' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        shortProgramOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        shortProgramOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032101' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        shortProgramOnline += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        certificationProgramOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        certificationProgramOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032102' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        certificationProgramOnline += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        icaOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        icaOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032104' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        icaOnline += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032201' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        corporateProgramOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032201' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        corporateProgramOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032201' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        corporateProgramOnline += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        ictOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        ictOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032105' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        ictOnline += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        consultationProgramOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        consultationProgramOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032203' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        consultationProgramOnline += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204' && scheduleItem.dataValues.ClassType.apiName === 'onsite') {
        assessmentProgramOnsite += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204' && scheduleItem.dataValues.ClassType.apiName === 'onsitecilandak') {
        assessmentProgramOnsiteCilandak += duration
      } else if (scheduleItem.dataValues.Plot.profitCenter === '0000032204' && scheduleItem.dataValues.ClassType.apiName === 'online') {
        assessmentProgramOnline += duration
      }
    })

    const totalData = shortProgramOnsite + shortProgramOnsiteCilandak + shortProgramOnline + certificationProgramOnsite + certificationProgramOnsiteCilandak + certificationProgramOnline + ictOnsite + ictOnsiteCilandak + ictOnline + icaOnsite + icaOnsiteCilandak + icaOnline + corporateProgramOnsite + corporateProgramOnsiteCilandak + corporateProgramOnline + consultationProgramOnsite + consultationProgramOnsiteCilandak + consultationProgramOnline + assessmentProgramOnsite + assessmentProgramOnsiteCilandak + assessmentProgramOnline

    let resultShortProgramOnsite = totalData > 0 ? `${((shortProgramOnsite / totalData) * 100).toFixed(2)}% (${(shortProgramOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultShortProgramOnsiteCilandak = totalData > 0 ? `${((shortProgramOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(shortProgramOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultShortProgramOnline = totalData > 0 ? `${((shortProgramOnline / totalData) * 100).toFixed(2)}% (${(shortProgramOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    let resultCertificationProgramOnsite = totalData > 0 ? `${((certificationProgramOnsite / totalData) * 100).toFixed(2)}% (${(certificationProgramOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultCertificationProgramOnsiteCilandak = totalData > 0 ? `${((certificationProgramOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(certificationProgramOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultCertificationProgramOnline = totalData > 0 ? `${((certificationProgramOnline / totalData) * 100).toFixed(2)}% (${(certificationProgramOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    let resultIctOnsite = totalData > 0 ? `${((ictOnsite / totalData) * 100).toFixed(2)}% (${(ictOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultIctOnsiteCilandak = totalData > 0 ? `${((ictOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(ictOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultIctOnline = totalData > 0 ? `${((ictOnline / totalData) * 100).toFixed(2)}% (${(ictOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    let resultIcaOnsite = totalData > 0 ? `${((icaOnsite / totalData) * 100).toFixed(2)}% (${(icaOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultIcaOnsiteCilandak = totalData > 0 ? `${((icaOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(icaOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultIcaOnline = totalData > 0 ? `${((icaOnline / totalData) * 100).toFixed(2)}% (${(icaOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    let resultCorporateProgramOnsite = totalData > 0 ? `${((corporateProgramOnsite / totalData) * 100).toFixed(2)}% (${(corporateProgramOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultCorporateProgramOnsiteCilandak = totalData > 0 ? `${((corporateProgramOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(corporateProgramOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultCorporateProgramOnline = totalData > 0 ? `${((corporateProgramOnline / totalData) * 100).toFixed(2)}% (${(corporateProgramOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    let resultConsultationProgramOnsite = totalData > 0 ? `${((consultationProgramOnsite / totalData) * 100).toFixed(2)}% (${(consultationProgramOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultConsultationProgramOnsiteCilandak = totalData > 0 ? `${((consultationProgramOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(consultationProgramOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultConsultationProgramOnline = totalData > 0 ? `${((consultationProgramOnline / totalData) * 100).toFixed(2)}% (${(corporateProgramOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    let resultAssessmentProgramOnsite = totalData > 0 ? `${((assessmentProgramOnsite / totalData) * 100).toFixed(2)}% (${(assessmentProgramOnsite / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultAssessmentProgramOnsiteCilandak = totalData > 0 ? `${((assessmentProgramOnsiteCilandak / totalData) * 100).toFixed(2)}% (${(assessmentProgramOnsiteCilandak / 1000 / 3600).toFixed(2)} jam)` : '0.00'
    let resultAssessmentProgramOnline = totalData > 0 ? `${((assessmentProgramOnline / totalData) * 100).toFixed(2)}% (${(corporateProgramOnline / 1000 / 3600).toFixed(2)} jam)` : '0.00'

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        shortProgramOnsite: resultShortProgramOnsite,
        shortProgramOnsiteCilandak: resultShortProgramOnsiteCilandak,
        shortProgramOnline: resultShortProgramOnline,
        certificationProgramOnsite: resultCertificationProgramOnsite,
        certificationProgramOnsiteCilandak: resultCertificationProgramOnsiteCilandak,
        certificationProgramOnline: resultCertificationProgramOnline,
        ictOnsite: resultIctOnsite,
        ictOnsiteCilandak: resultIctOnsiteCilandak,
        ictOnline: resultIctOnline,
        icaOnsite: resultIcaOnsite,
        icaOnsiteCilandak: resultIcaOnsiteCilandak,
        icaOnline: resultIcaOnline,
        corporateProgramOnsite: resultCorporateProgramOnsite,
        corporateProgramOnsiteCilandak: resultCorporateProgramOnsiteCilandak,
        corporateProgramOnline: resultCorporateProgramOnline,
        consultationProgramOnsite: resultConsultationProgramOnsite,
        consultationProgramOnsiteCilandak: resultConsultationProgramOnsiteCilandak,
        consultationProgramOnline: resultConsultationProgramOnline,
        assessmentProgramOnsite: resultAssessmentProgramOnsite,
        assessmentProgramOnsiteCilandak: resultAssessmentProgramOnsiteCilandak,
        assessmentProgramOnline: resultAssessmentProgramOnline,
      }
    })
  } catch (err) {
    next(err)
  }
}