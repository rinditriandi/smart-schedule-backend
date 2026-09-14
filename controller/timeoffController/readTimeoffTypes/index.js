const { TimeoffType } = require('../../../models')

module.exports = async (req, res, next) => {
  try {
    const findTimeoffTypes = await TimeoffType.findAll()

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: findTimeoffTypes
    })
  } catch (err) {
    next(err)
  }
}