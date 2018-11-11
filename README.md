+ [Installation](#installation)
+ [Configuration](#configuration)
+ [Usage](#usage)

## Installation

```sh
# npm
npm install knex-toolkit --save

# yarn
yarn add knex-toolkit
```

## Configuration

```json
'use strict'
const { join } = require('path')

module.exports = {
  development: {
    db: {
      exemple: {
        client: 'mysql',
        connection: {
          host: '',
          port: 3306,
          user: '',
          password: '',
          database: '',
          charset: 'utf8mb4',
          collate: 'utf8mb4_unicode_ci'
        },
        debug: false,
        pool: {
          min: 2,
          max: 10
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
```
## Usage

```sh
knex-toolkit migrate make create_users -d exemple -e development -c ../src/configuration.js
```

# License

MIT © Alain Cajuste