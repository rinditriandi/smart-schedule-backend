const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { client } = req.query
    if (!client) throw { code: '400', errors: ['client is required'] }

    // Getting salesforce's token
    const gettingSfTokenFormData = new FormData()
    gettingSfTokenFormData.append('username', process.env.SF_USERNAME)
    gettingSfTokenFormData.append('password', process.env.SF_PASSWORD)
    gettingSfTokenFormData.append('grant_type', 'password')
    gettingSfTokenFormData.append('client_id', process.env.SF_CLIENT_ID)
    gettingSfTokenFormData.append('client_secret', process.env.SF_CLIENT_SECRET)
    const gettingSfToken = await axios({
      url: `${process.env.SF_URL}/services/oauth2/token`,
      method: 'POST',
      headers: {
        'Accept-Encoding': 'application/json'
      },
      data: gettingSfTokenFormData
    })
    if (!gettingSfToken?.data?.access_token) throw { code: '500', errors: ['an error occur when getting token from salesforce'] }

    // Getting data clients
    let endpointClient = `${process.env.SF_URL}/services/data/v53.0/query?q=SELECT+Id,Name+FROM+ACCOUNT+WHERE+NAME+LIKE+'%25${client}%25'+LIMIT+5`
    const gettingClients = await axios({
      url: endpointClient,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'Authorization': `Bearer ${gettingSfToken.data.access_token}`
      }
    })
    if (!gettingClients?.data?.records) throw { code: '500', errors: ['an error occur when getting accounts from salesforce'] }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingClients.data.records
    })
  } catch (err) {
    next(err)
  }
}