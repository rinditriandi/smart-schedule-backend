const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { programschedule } = req.query
    if (!programschedule) throw { code: '400', errors: ['opportunity is required'] }

    const gettingProgramSchedules = await axios({
      url: `${process.env.SF_URL}/get_list/wbs_odoo?name=${programschedule}`,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'elikey': '@Pmeli2021!'
      }
    })
    if (gettingProgramSchedules?.status !== 200) throw { code: gettingProgramSchedules.status, errors: ['an error occur when getting program schedule from salesforce'] }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingProgramSchedules?.data
    })
  } catch (err) {
    if(err?.response?.status === 400) {
      next({code: '400', errors: [err?.response?.data?.message]})
    } else {
      next(err?.response?.data || err)
    }
  }
}