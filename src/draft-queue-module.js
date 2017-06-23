'use strict'

const uuidService = require('./uuid-service.js')
const draftQueueProvider = require('./draft-queue-provider.js')
const draftQueueList = require('./draft-queue-list-component.js')

angular
  .module('bmDraftQueue', ['LocalForageModule'])
  .provider('bmDraftQueueService', draftQueueProvider)
  .service('uuidService', uuidService)
  .component('draftQueueList', draftQueueList)
