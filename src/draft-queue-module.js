'use strict'

const uuidService = require('./uuid-service.js')
const draftQueueProvider = require('./draft-queue-provider.js')

angular
  .module('bmDraftQueue', ['LocalForageModule'])
  .provider('draftQueue', draftQueueProvider)
  .service('uuidService', uuidService)
