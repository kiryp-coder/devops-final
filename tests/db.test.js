const { checkDatabase } = require('../src/db')

const databaseIsConfigured = Boolean(process.env.DB_HOST)
const testIfDatabase = databaseIsConfigured ? test : test.skip

describe('Подключение к базе данных', () => {
  testIfDatabase('PostgreSQL отвечает на запрос SELECT 1', async () => {
    expect(await checkDatabase()).toBe(true)
  })
})
