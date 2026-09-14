if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const routes = require('./routes')
const { errorHandler } = require('./middlewares')
const cors = require('cors')
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/assets', express.static('assets'))
app.use('/api', routes)

app.use(errorHandler)

app.listen(PORT, () => console.log('Server is running on port', PORT))