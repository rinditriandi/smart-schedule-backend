const { Plot, PlotPermission, PlotSapProjectId, Schedule, ClassType, ActivityType, Consultant } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const findPlot = await Plot.findByPk(id, {
      include: [
        {
          model: PlotPermission
        },
        {
          model: PlotSapProjectId
        },
        {
          model: Schedule,
          include: [
            {
              model: ClassType
            },
            {
              model: ActivityType
            },
            {
              model: Consultant
            },
          ]
        }
      ]
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