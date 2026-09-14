const { sequelize } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    await sequelize.authenticate()

    res.status(200).json({
      code: '200',
      status: 'OK'
    })
  } catch (err) {
    next(err)
  }
}