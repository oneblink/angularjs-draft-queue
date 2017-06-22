'use strict'

DraftQueueListController.$inject = ['$scope', '$q', '$sce', '$window', 'bmDraftQueueService']
function DraftQueueListController($scope, $q, $sce, $window, bmDraftQueueService) {
  const $ctrl = this
  const watchers = []

  let fetching = false

  $ctrl.$onInit = function () {
    $ctrl.draftQueue = []
    if (!$ctrl.displayRemove) {
      $ctrl.displayRemove = '&#x2718;'
    }
    $ctrl.displayRemove = $sce.trustAsHtml($ctrl.displayRemove)
    watchers.push($scope.$on('bmDraftQueueRemove', $ctrl.getQueue))
    watchers.push($scope.$on('bmDraftQueueAdd', $ctrl.getQueue))
    $ctrl.getQueue()
  }

  $ctrl.$onDestroy = function () {
    watchers.forEach((w) => w())
  }

  $ctrl.selectItem = function(item) {
    $ctrl.onSelectItem && $ctrl.onSelectItem({item})
  }

  const remove = (uuid) => bmDraftQueueService.removeItem(uuid).then($ctrl.getQueue)
  $ctrl.removeItem = function(uuid) {
    if ($ctrl.onRemoveItem) {
      return bmDraftQueueService.getItem(uuid)
        .then((item) => $ctrl.onRemoveItem({item}))
        .then(remove)
        .catch(() => false)
    }

    if ($window.confirm('Are you sure you want to remove this item?')) {
      return remove(uuid)
    }
  }

  $ctrl.getQueue = function() {
    if (fetching) {
      return Promise.resolve()
    }

    fetching = true
    const oldQueue = $ctrl.draftQueue || []
    $ctrl.draftQueue.length = 0
    return bmDraftQueueService.iterate((item) => {
      $ctrl.draftQueue.push(item)
    })
    .catch(() => $ctrl.draftQueue = oldQueue)
    .then(() => fetching = false)
  }

  $ctrl.clear = function () {
    return bmDraftQueueService.clear()
  }
}

module.exports = {
  controller: DraftQueueListController,
  controllerAs: 'DraftQueueListCtrl',
  template: `<div class="bm-draft-queue">
  <ul class="bm-draft-queue__list">
    <li class="bm-draft-queue__list-item" ng-repeat="item in DraftQueueListCtrl.draftQueue">
      <a  class="bm-draft-queue__select-item"
          title="Select item"
          href=""
          ng-click="DraftQueueListCtrl.selectItem(item.model)">{{item.form}} - Created at {{item.dateCreated | date:'hh:mm dd/MMM/y'}}</a>
      <a class="bm-draft-queue__remove-item bm-button__icon"
         href=""
         title="Remove Item"
         ng-click="DraftQueueListCtrl.removeItem(item.model._uuid)"
         ng-bind-html="DraftQueueListCtrl.displayRemove"></a>
    </li>
  </ul>

  <a href="" class="bm-draft-queue__clear"
     ng-click="DraftQueueListCtrl.clear()"> Remove all</a>
</div>
`,
  bindings: {
    displayRemove: '@?',
    onSelectItem: '&?',
    onRemoveItem: '&?'
  }
}
