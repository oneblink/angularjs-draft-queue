'use strict'

const app = angular.module('app', ['bmDraftQueue'])

app.config(['draftQueueProvider', function (draftQueueProvider) {
  draftQueueProvider.config({appName: 'e2eTest'})
}])

app.controller('testCtrl', ['$http', '$scope', '$timeout', '$log', 'draftQueue',
  function($http, $scope, $timeout, $log, draftQueue) {
    const $ctrl = this
    $ctrl.model = {}

    $ctrl.saveDraft = function(item) {
      draftQueue.setItem(item, 'testCtrl').then((item) => {
        $ctrl.lastSaved = item.model._uuid
      })
    }
  }
])

angular.bootstrap(document, ['app'])
