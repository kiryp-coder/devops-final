const promClient = require('prom-client')

const register = new promClient.Registry()

promClient.collectDefaultMetrics({ register })

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Общее количество HTTP-запросов',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

function countRequests(req, res, next) {
  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      route: req.path,
      status_code: res.statusCode,
    })
  })
  next()
}

module.exports = { register, countRequests }
