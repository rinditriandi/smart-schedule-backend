const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params

    // Getting data clients
    const gettingOpportunities = await axios({
      url: `${process.env.SF_URL}/opportunities/${id}`,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'elikey': '@Pmeli2021!'
      }
    })

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingOpportunities?.data?.data
    })
  } catch (err) {
    next(err)
  }
}