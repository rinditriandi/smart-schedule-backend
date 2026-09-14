const { Schedule } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params

    const findTimeoff = await Schedule.findByPk(id)
    if (!findTimeoff) throw { code: '404', errors: ['timeoff not found'] }

    await Schedule.destroy({
      where: {
        id: findTimeoff.id
      }
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findTimeoff
    })
  } catch (err) {
    next(err)
  }
}