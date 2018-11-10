'use strict'
const { join } = require('path')

module.exports = {
  development: {
    db: {
      exemple: {
        client: 'sqlite3',
        connection: {
          filename: join(process.cwd(), 'exemple', 'exemple.sqlite')
        },
        debug: false,
        useNullAsDefault: true,
        pool: {
          min: 0,
          max: 1
        },
        migrations: {
          tableName: 'knex_migrations',
          directory: join(process.cwd(), 'exemple', 'migrations')
        },
        seeds: {
          directory: join(process.cwd(), 'exemple', 'seeds', 'development')
        }
      }
    }
  }
}
