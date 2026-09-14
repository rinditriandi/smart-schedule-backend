const axios = require('axios')
const FormData = require('form-data')
const { Plot, PlotSapProjectId } = require('../../../models')

module.exports = async (req, res, next) => {
  let opportunity = null
  let programSchedule = null
  try {
    const now = new Date().getTime()
    const { id } = req.params

    // Find Plot
    const findPlot = await Plot.findByPk(id)
    if (!findPlot || findPlot?.isDeleted) throw { code: '404', errors: ['plot not found'] }
    if (!findPlot?.odooWbsId) throw { code: '404', errors: ['project not found or not sync'] }
    
    const gettingProgramSchedule = await axios({
      url: `${process.env.SF_URL}/get_list/wbs_odoo?id=${findPlot.odooWbsId}`,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'elikey': '@Pmeli2021!'
      }
    })
    programSchedule = gettingProgramSchedule.data[0]

    let wbsPeriod_ = null
    if (programSchedule?.WBS_Period__c) {
      wbsPeriod_ = new Date(programSchedule?.WBS_Period__c)
      wbsPeriod_.setHours(0, 0, 0, 0)
    }

    await Plot.update(
      {
        topic: programSchedule?.Program_Schedule_Name__c,
        client: programSchedule?.Account__r?.name || '',
        group: programSchedule?.PIC_of_APM__c?.name,
        wbsPeriod: wbsPeriod_ ? wbsPeriod_.getTime() : null,
        sales: programSchedule?.Total_Sales,
        name: programSchedule?.Program_Schedule_Name__c,
        // name: "edit",
        updatedAt: now
      },
      {
        where: {
          id: findPlot.id
        }
      }
    )

    // Find updated plot
    const updatedPlot = await Plot.findByPk(findPlot.id)

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: updatedPlot
    })
  } catch (err) {
    if (err?.response?.data) {
      next({ code: err.response.data.code, errors: err.response.data.errors })
    } else {
      next(err)
    }
  }
}