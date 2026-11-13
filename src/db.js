const { Client } = require('pg')

function databaseSettings() {
  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  }
}

async function checkDatabase() {
  const client = new Client(databaseSettings())
  await client.connect()
  const result = await client.query('SELECT 1 AS ok')
  await client.end()
  return result.rows[0].ok === 1
}

module.exports = { checkDatabase }
