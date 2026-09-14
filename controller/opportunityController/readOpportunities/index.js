const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { opportunity } = req.query
    if (!opportunity) throw { code: '400', errors: ['opportunity is required'] }

    const gettingOpportunities = await axios({
      url: `${process.env.SF_URL}/get_list/wbs_odoo?name=${opportunity}`,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'elikey': '@Pmeli2021!'
      }
    })
    if (!gettingOpportunities?.data) throw { code: '500', errors: ['an error occur when getting accounts from salesforce'] }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingOpportunities?.data
    })
  } catch (err) {
    next(err)
  }
}