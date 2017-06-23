'use strict'

const uuidService = require('./uuid-service.js')
const draftQueueProvider = require('./draft-queue-provider.js')
const draftQueueList = require('./draft-queue-list-component.js')
const draftQueueInterceptor = require('./draft-queue-interceptor.js')

angular
  .module('bmDraftQueue', ['LocalForageModule'])
  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('bmDraftQueueInterceptor')
  }])
  .provider('bmDraftQueueService', draftQueueProvider)
  .factory('bmDraftQueueInterceptor', draftQueueInterceptor)
  .service('uuidService', uuidService)
  .component('draftQueueList', draftQueueList)
