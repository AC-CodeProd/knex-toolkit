#!/usr/bin/env node
const yargs = require('yargs')
const chalk = require('chalk')
const knexToolkit = require('./')

const help = `
Usage
  $ knex-migrate <command> [options]
  Commands:
    migrate make <migration_name> Generate migration
    migrate latest Executed all migrations
    migrate rollback
    migrate currentVersion
    seed make
    seed run
    create database

  Options:
    --database, -d 
    --configuration, -c 

  Examples:
    $ knex-toolkit migrate make create_users # generate migration creating users table
    $ node node_modules/knex-toolkit/lib/cli.js migrate rollback -d boilerplate -c /var/www/backend/config/docker/index.js
    $ node node_modules/knex-toolkit/lib/cli.js create database -d boilerplate -c /var/www/backend/config/docker/index.js
`

const options = {
  'database': {
    alias: 'd',
    description: 'Database name',
    required: true
  },
  'configuration': {
    alias: 'c',
    description: 'Configuration of knex',
    required: true
  }
}

const malformedConfig = `
Malformed config:
Examples:
'use strict'
const { join } = require('path')

module.exports = {
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
`

const firstCommandAuthorized = ['migrate', 'seed', 'create']
const secondCommandAuthorized = ['make', 'latest', 'rollback', 'currentVersion', 'run', 'database']

async function main () {
  const argv = yargs
    .usage(help)
    .options(options)
    .argv
  const commands = argv._

  if (!firstCommandAuthorized.includes(commands[0])) {
    yargs.showHelp()
    throw new Error(`Invalid first command, authorized value: ${firstCommandAuthorized.join(', ')}`)
  }

  if (!secondCommandAuthorized.includes(commands[1])) {
    yargs.showHelp()
    throw new Error(`Invalid second command, authorized value: ${secondCommandAuthorized.join(', ')}`)
  }

  let fileName = ''

  if (commands[1] === 'make') {
    if (!commands[2]) {
      yargs.showHelp()
      throw new Error(`Invalid command between a third value please`)
    } else {
      fileName = commands[2]
    }
  }

  const config = argv.c
  const database = argv.d
  let configuration

  try {
    configuration = require(`${config}`)
  } catch (err) {
    yargs.showHelp()
    throw err
  }

  if (!Object.keys(configuration).includes('db')) {
    throw new Error(malformedConfig)
  }

  const { db } = configuration

  if (!db || !db[database]) {
    throw new Error(malformedConfig)
  }

  if (!db[database].migrations || !db[database].migrations.directory) {
    throw new Error(`No migrations directory in config`)
  }

  if (!db[database].seeds || !db[database].seeds.directory) {
    throw new Error(`No seeds directory in config`)
  }

  knexToolkit(`${commands[0]}:${commands[1]}`, fileName, db[database])
}

main().then(() => {

},
err => {
  if (err instanceof Error) {
    console.error(chalk.red(err.stack))
  } else {
    console.error(chalk.red(err))
  }
  process.exit(1)
})
