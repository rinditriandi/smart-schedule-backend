const axios = require('axios')
const FormData = require('form-data')
const { Plot, PlotPermission, PlotSapProjectId } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { id } = req.params
    const { OpportunityId, plotPermissions, name, wbs, sales, topic, client, sapProjectId, group, profitCenter, programCategory, sapId, planHours } = req.body
    let { wbsPeriod, salesPeriod } = req.body
    if (wbsPeriod) {
      let wbsPeriod_ = new Date(wbsPeriod)
      wbsPeriod_.setHours(0, 0, 0, 0)
      wbsPeriod = wbsPeriod_.getTime()
    }
    if (salesPeriod) {
      let salesPeriod_ = new Date(salesPeriod)
      salesPeriod_.setHours(0, 0, 0, 0)
      salesPeriod = salesPeriod_.getTime()
    }

    // Validate plot permission
    if (plotPermissions && !Array.isArray(plotPermissions)) throw { code: '400', errors: ['invalid plot permissions body'] }
    if (plotPermissions) {
      let isValidPlotPermissions = true
      plotPermissions.forEach(permission => {
        if (!permission?.email) {
          isValidPlotPermissions = false
        }
      })
      if (!isValidPlotPermissions) throw { code: '400', errors: ['invalid plot permissions body'] }
    }

    // Find Plot
    const findPlotBefore = await Plot.findByPk(id)
    if (!findPlotBefore || findPlotBefore?.isDeleted) throw { code: '404', errors: ['plot not found'] }

    // Find Plot
    if (OpportunityId) {
      const findPlot = await Plot.findOne({
        where: {
          OpportunityId
        }
      })
      if (findPlot && findPlot?.id != id) throw { code: '400', errors: ['opportunity id has been used in another plot'] }
    }

    await Plot.update(
      {
        OpportunityId: OpportunityId,
        topic: topic,
        client: client,
        group: group,
        name,
        profitCenter,
        programCategory,
        wbs: wbs || null,
        wbsPeriod: wbsPeriod || null,
        salesPeriod: salesPeriod || null,
        sales: sales || null,
        planHours: planHours || null,
        sapId,
        updatedAt: new Date().getTime()
      },
      {
        where: {
          id: findPlotBefore.id
        }
      }
    )

    // Delete old permissions
    await PlotPermission.destroy({
      where: {
        PlotId: findPlotBefore.id
      }
    })

    // Create new permissions
    await PlotPermission.bulkCreate(plotPermissions.map(permission => {
      return {
        PlotId: findPlotBefore.id,
        email: permission.email,
        name: permission?.name || null,
        createdAt: now,
        updatedAt: now
      }
    }))

    // Find updated plot
    const updatedPlot = await Plot.findByPk(findPlotBefore.id)

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: updatedPlot
    })
  } catch (err) {
    next(err)
  }
}