const express = require('express')
const { register, countRequests } = require('./metrics')

const app = express()

app.use(countRequests)

app.get('/', (req, res) => {
  res.type('text/plain').send('DevOps Final Project')
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

module.exports = app
