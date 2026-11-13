const request = require('supertest')
const app = require('../src/app')

describe('Маршруты приложения', () => {
  test('GET / возвращает строку "DevOps Final Project"', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.text).toBe('DevOps Final Project')
  })

  test('GET /health возвращает { status: "ok" }', async () => {
    const response = await request(app).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })

  test('GET /metrics отдаёт метрики в формате Prometheus', async () => {
    const response = await request(app).get('/metrics')

    expect(response.status).toBe(200)
    expect(response.headers['content-type']).toContain('text/plain')
    expect(response.text).toContain('process_cpu_user_seconds_total')
    expect(response.text).toContain('# TYPE http_requests_total counter')
  })

  test('счётчик http_requests_total растёт после запросов', async () => {
    await request(app).get('/health')
    await request(app).get('/health')

    const metrics = (await request(app).get('/metrics')).text

    expect(metrics).toMatch(/http_requests_total\{method="GET",route="\/health",status_code="200"\} [2-9]/)
  })
})
