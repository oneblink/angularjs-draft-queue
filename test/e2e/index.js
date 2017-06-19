'use strict'

const app = angular.module('app', ['bmDraftQueue'])

app.config(['draftQueueProvider', function (draftQueueProvider) {
  draftQueueProvider.config({appName: 'e2eTest'})
}])

app.controller('testCtrl', ['$http', '$scope', '$timeout', '$log', 'draftQueue',
  function($http, $scope, $timeout, $log, draftQueue) {
    const $ctrl = this
    $ctrl.model = {}

    $ctrl.saveDraft = function(model) {
      draftQueue.setItem(model, 'testCtrl').then((item) => {
        $ctrl.lastSaved = item.model._uuid
        item.dateCreated = new Date(item.dateCreated)
        item.dateModified = new Date(item.dateModified)
        $ctrl.draftItem = item
        $ctrl.model = angular.copy(item.model)
      })
    }
  }
])

angular.bootstrap(document, ['app'])
