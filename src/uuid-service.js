'use strict'

const uuid = require('uuid/v4')

function uuidService() {
  return () => uuid()
}

module.exports = uuidService
