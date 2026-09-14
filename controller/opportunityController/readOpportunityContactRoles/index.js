const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { opportunityId } = req.params
    if (!opportunityId) throw { code: '400', errors: ['opportunity id is required'] }

    const gettingOpportunityContactRoles = await axios({
      url: `${process.env.SF_URL}/opportunities/contactRoles/${opportunityId}`,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'elikey': '@Pmeli2021!'
      }
    })
    if (!gettingOpportunityContactRoles?.data?.data) throw { code: '500', errors: ['an error occur when getting accounts from salesforce'] }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingOpportunityContactRoles?.data?.data
    })
  } catch (err) {
    next(err)
  }
}