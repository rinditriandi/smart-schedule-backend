const axios = require('axios')
const FormData = require('form-data')
const { Plot, PlotPermission, PlotSapProjectId } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const now = new Date().getTime()
    const { odooWbsId, plotPermissions, name, wbs, sales, topic, client, group, planHours } = req.body
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

    // Find plot
    if (odooWbsId) {
      const findPlot = await Plot.findOne({
        where: {
          odooWbsId
        }
      })
      if (findPlot) throw { code: '400', errors: ['plot already exist'] }
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

    // Insert new plot
    const newPlot = await Plot.create({
      name: name,
      topic: topic,
      client: client,
      group: group,
      wbs: wbs || null,
      wbsPeriod: wbsPeriod || null,
      salesPeriod: salesPeriod || null,
      sales: sales || null,
      planHours: planHours || null,
      odooWbsId,
      createdAt: now,
      updatedAt: now
    })

    // Insert plot permissions
    await PlotPermission.bulkCreate(plotPermissions.map(permission => {
      return {
        PlotId: newPlot.id,
        email: permission.email,
        name: permission?.name || null,
        createdAt: now,
        updatedAt: now
      }
    }))

    res.status(201).json({
      code: '201',
      status: 'CREATED',
      data: newPlot
    })
  } catch (err) {
    next(err)
  }
}