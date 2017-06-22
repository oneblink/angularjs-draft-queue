'use strict'

const app = angular.module('app', ['bmDraftQueue', 'mockBackend'])

app.config(['bmDraftQueueServiceProvider', function (draftQueueProvider) {
  draftQueueProvider.config({appName: 'e2eTest'})
}])

app.controller('testCtrl', ['$http', '$scope', '$timeout', '$log', 'bmDraftQueueService',
  function($http, $scope, $timeout, $log, draftQueue) {
    const $ctrl = this

    $ctrl.saveDraft = function(model) {
      draftQueue.setItem(model, 'testCtrl').then((item) => {
        $ctrl.lastSaved = item.model._uuid
        item.dateCreated = new Date(item.dateCreated)
        item.dateModified = new Date(item.dateModified)
        $ctrl.draftItem = item
        $ctrl.model = angular.copy(item.model)
      })
    }

    $ctrl.new = function () {
      $ctrl.model = {}
    }

    $ctrl.load = function (item) {
      $ctrl.model = item
    }

    $ctrl.send = function (item) {
      $http.post('/url', item)
    }

    $ctrl.new()
  }
])

angular.bootstrap(document, ['app'])
