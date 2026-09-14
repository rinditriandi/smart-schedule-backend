const axios = require('axios')
const FormData = require('form-data')

module.exports = async (req, res, next) => {
  try {
    const { topic } = req.query
    if (!topic) throw { code: '400', errors: ['topic is required'] }

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
    let endpointTopic = `${process.env.SF_URL}/services/data/v53.0/query?q=SELECT+ID,NAME+FROM+PRODUCT2+WHERE+NAME+LIKE+'%25${topic}%25'+LIMIT+5`
    const gettingTopics = await axios({
      url: endpointTopic,
      method: 'GET',
      headers: {
        'Accept-Encoding': 'application/json',
        'Authorization': `Bearer ${gettingSfToken.data.access_token}`
      }
    })
    if (!gettingTopics?.data?.records) throw { code: '500', errors: ['an error occur when getting accounts from salesforce'] }

    res.status(200).json({
      code: '200',
      status: 'OK',
      data: gettingTopics.data.records
    })
  } catch (err) {
    next(err)
  }
}