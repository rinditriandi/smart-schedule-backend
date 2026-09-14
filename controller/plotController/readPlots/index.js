const { Plot, PlotSapProjectId } = require('../../../models')
const { Op } = require('sequelize')

module.exports = async (req, res, next) => {
  try {
    const { page = 1, search } = req.query

    const limit = 10
    const count = await Plot.count()
    const findPlots = await Plot.findAll({
      order: [['id', 'DESC']],
      limit,
      offset: (Number(page) - 1) * limit,
      where: {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search || ''}%`
            }
          },
          {
            wbs: {
              [Op.like]: `%${search || ''}%`
            }
          },
          {
            topic: {
              [Op.like]: `%${search || ''}%`
            }
          },
          {
            client: {
              [Op.like]: `%${search || ''}%`
            }
          },
          {
            profitCenter: {
              [Op.like]: `%${search || ''}%`
            }
          }
        ]
      }
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: {
        totalItems: count,
        items: findPlots,
        totalPages: findPlots.length == 0 ? 1 : Math.ceil(count / limit),
        currentPage: Number(page)
      }
    })
  } catch (err) {
    next(err)
  }
}