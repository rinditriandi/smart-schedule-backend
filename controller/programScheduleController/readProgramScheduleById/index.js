const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params

    // Getting data clients
    const gettingProgramSchedule = await axios({
      url: `${process.env.SF_URL}/get_list/wbs_odoo?id=${id}`,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'elikey': '@Pmeli2021!'
      }
    })
    if (gettingProgramSchedule?.status !== 200) throw { code: gettingProgramSchedule.status, errors: ['an error occur when getting program schedule from salesforce'] }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingProgramSchedule.data[0]
    })
  } catch (err) {
    if(err?.response?.status === 400) {
      next({code: '400', errors: [err?.response?.data?.message]})
    } else {
      next(err?.response?.data || err)
    }
  }
}