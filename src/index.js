#!/usr/bin/env node

const knex = require('knex')
const fs = require('fs')
const chalk = require('chalk')

function exit (text) {
  if (text instanceof Error) {
    console.error(chalk.red(text.stack))
  } else {
    console.error(chalk.red(text))
  }
  process.exit(1)
}

function success (text) {
  console.log(text)
  process.exit(0)
}

async function knexToolkit (command, name, config) {
  if (command === 'create:database') {
    config.connection.database = null
  }
  const db = knex(config)
  switch (command) {
    case 'migrate:make':
      console.log('migrate:make')
      console.log('Create a named migration file.')
      return db
        .migrate
        .make(name)
        .then((_name) => {
          fs.chmodSync(_name, '0777')
          success(chalk.green(`Created Migration: ${_name}`))
        })
        .catch(exit)
    case 'migrate:latest':
      console.log('migrate:latest')
      console.log('Run all migrations that have not yet been run.')
      return db
        .migrate
        .latest()
        .spread((batchNo, log) => {
          if (log.length === 0) {
            success(chalk.cyan('Already up to date'))
          }
          success(chalk.green(`Batch ${batchNo} run: ${log.length} migrations \n`) +
            chalk.cyan(log.join('\n')))
        })
        .catch(exit)
    case 'migrate:rollback':
      console.log('migrate:rollback')
      console.log('Rollback the last set of migrations performed.')
      return db
        .migrate
        .rollback()
        .spread((batchNo, log) => {
          if (log.length === 0) {
            success(chalk.cyan('Already at the base migration'))
          }
          success(chalk.green(`Batch ${batchNo} rolled back: ${log.length} migrations \n`) + chalk.cyan(log.join('\n')))
        })
        .catch(exit)
    case 'migrate:currentVersion':
      console.log('migrate:currentVersion')
      console.log('View the current version for the migration.')
      return db
        .migrate
        .currentVersion()
        .then((version) => {
          success(chalk.green('Current Version: ') + chalk.blue(version))
        })
        .catch(exit)
    case 'seed:make':
      console.log('seed:make')
      console.log('Create a named seed file.')
      return db
        .seed
        .make(name)
        .then((_name) => {
          fs.chmodSync(_name, '0777')
          success(chalk.green(`Created seed file: ${_name}`))
        })
        .catch(exit)
    case 'seed:run':
      console.log('seed:run')
      console.log('Run all seed that have not yet been run.')
      return db
        .seed
        .run()
        .spread((log) => {
          if (log.length === 0) {
            success(chalk.cyan('No seed files exist'))
          }
          success(chalk.green(`Ran ${log.length} seed files \n${chalk.cyan(log.join('\n'))}`))
        })
        .catch(exit)
    case 'create:database':
      console.log('create:database')
      await db.raw(`CREATE DATABASE ${name}`)
      await db.destroy()
      break
    default:
      throw new Error(`Unknown ${command} options, exiting`)
  }
}

module.exports = knexToolkit
module.exports.default = knexToolkit
