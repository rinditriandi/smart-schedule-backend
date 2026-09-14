const axios = require('axios')

module.exports = async (req, res, next) => {
  try {
    const { search } = req.query
    const token = await axios({
      url: `${process.env.PEBS_URL}/users/manualLoginPmeli2021`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'application/json'
      },
      data: {
        email: 'it.system@prasmul-eli.co'
      }
    })
    const users = await axios({
      url: `${process.env.PEBS_URL}/users?search=${search || ''}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.data.data.token}`,
        'Content-Type': 'application/json',
        'Accept-Encoding': 'application/json'
      }
    })
    res.status(200).json({
      code: '200',
      status: 'OK',
      data: users.data.data
    })
  } catch (err) {
    next(err)
  }
}