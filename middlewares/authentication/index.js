const axios = require('axios')

const authentication = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw { code: '401', errors: ['invalid token'] }
    const headerSplit = req.headers.authorization.split(' ')
    const token = headerSplit[headerSplit.length - 1]

    const { appapiname, modapiname, policy } = req.headers
    if (!appapiname || !modapiname || !policy) throw { code: '401', errors: ['invalid token'] }

    const { data } = await axios({
      url: `${process.env.PEBS_URL}/users/checkPolicy`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept-Encoding': 'application/json'
      },
      data: {
        appApiName: appapiname,
        modApiName: modapiname,
        policy: policy,
      },
      responseType: 'json'
    })

    req.user = data?.data
    req.user.token = token
    next()

  } catch (err) {
    if (err?.response?.data) {
      next(err.response.data)
    } else {
      next(err)
    }
  }
}

module.exports = { authentication }