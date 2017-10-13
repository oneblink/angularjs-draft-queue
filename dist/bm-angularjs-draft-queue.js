(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.bmDraftQueue = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection
var rng$1;

var crypto = commonjsGlobal.crypto || commonjsGlobal.msCrypto; // for IE 11
if (crypto && crypto.getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16);
  rng$1 = function whatwgRNG() {
    crypto.getRandomValues(rnds8);
    return rnds8;
  };
}

if (!rng$1) {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);
  rng$1 = function rng$1() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}

var rngBrowser = rng$1;

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid$1(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  return bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + '-' + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]] + bth[buf[i++]];
}

var bytesToUuid_1 = bytesToUuid$1;

var rng = rngBrowser;
var bytesToUuid = bytesToUuid_1;

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof options == 'string') {
    buf = options == 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

var v4_1 = v4;

var uuid = v4_1;

function uuidService$1() {
  return function () {
    return uuid();
  };
}

var uuidService_1 = uuidService$1;

function draftQueueProvider$1() {
  var _dbName = 'blinkDrafts';
  var _appName = void 0;

  this.config = function (_ref) {
    var _ref$dbName = _ref.dbName,
        dbName = _ref$dbName === undefined ? 'bmDrafts' : _ref$dbName,
        appName = _ref.appName;

    _dbName = dbName;
    _appName = appName;
  };

  this.$get = ['$rootScope', '$localForage', 'uuidService', function ($rootScope, $localForage, uuid) {
    if (angular.isUndefined(_appName)) {
      throw new Error('You must specify an appName in your applications .config function before using this service');
    }
    var lf = $localForage.createInstance({
      name: _dbName,
      storeName: _appName,
      description: 'Blink Mobile Draft Queue Storage'
    });

    var createDraft = function createDraft(model, formName) {
      var createdDate = new Date().getTime();
      var newDraft = {
        model: model,
        form: formName,
        dateCreated: createdDate,
        dateModified: createdDate
      };

      return newDraft;
    };

    var broadcastSaveEvent = function broadcastSaveEvent(item) {
      $rootScope.$broadcast('bmDraftQueueAdd', item);

      return item;
    };

    var service = {
      setItem: function setItem(model, formName) {
        if (!model) {
          throw new Error('model must be defined');
        }

        if (!formName) {
          throw new Error('formName must be defined');
        }

        if (model._uuid) {
          return lf.getItem(model._uuid).then(function (data) {
            // has not been saved as a draft
            if (!data) {
              return lf.setItem(model._uuid, createDraft(model, formName)).then(broadcastSaveEvent);
            }

            // update existing draft
            var updatedDraft = {
              model: model,
              form: data.form,
              dateCreated: data.dateCreated,
              dateModified: new Date().getTime()
            };

            return lf.setItem(model._uuid, updatedDraft).then(broadcastSaveEvent);
          });
        }

        model._uuid = uuid();
        return lf.setItem(model._uuid, createDraft(model, formName)).then(broadcastSaveEvent);
      },

      getItem: function getItem(uuid) {
        return lf.getItem(uuid);
      },

      removeItem: function removeItem(uuid) {
        return lf.removeItem(uuid).then(function (item) {
          $rootScope.$broadcast('bmDraftQueueRemove', item);

          return item;
        });
      },

      clear: function clear() {
        return lf.clear();
      },

      iterate: function iterate(iter) {
        return lf.iterate(iter);
      },

      length: function length() {
        return lf.length();
      },

      instance: function instance() {
        return lf;
      }
    };

    return service;
  }];
}

var draftQueueProvider_1 = draftQueueProvider$1;

DraftQueueListController.$inject = ['$scope', '$q', '$sce', '$window', 'bmDraftQueueService'];
function DraftQueueListController($scope, $q, $sce, $window, bmDraftQueueService) {
  var $ctrl = this;
  var watchers = [];

  var fetching = false;

  $ctrl.$onInit = function () {
    $ctrl.draftQueue = [];
    if (!$ctrl.displayRemove) {
      $ctrl.displayRemove = '&#x2718;';
    }
    $ctrl.displayRemove = $sce.trustAsHtml($ctrl.displayRemove);
    watchers.push($scope.$on('bmDraftQueueRemove', $ctrl.getQueue));
    watchers.push($scope.$on('bmDraftQueueAdd', $ctrl.getQueue));
    $ctrl.getQueue();
  };

  $ctrl.$onDestroy = function () {
    watchers.forEach(function (w) {
      return w();
    });
  };

  $ctrl.selectItem = function (item) {
    $ctrl.onSelectItem && $ctrl.onSelectItem({ item: item });
  };

  var remove = function remove(uuid) {
    return bmDraftQueueService.removeItem(uuid).then($ctrl.getQueue);
  };
  $ctrl.removeItem = function (uuid) {
    if ($ctrl.onRemoveItem) {
      return bmDraftQueueService.getItem(uuid).then(function (item) {
        return $ctrl.onRemoveItem({ item: item });
      }).then(remove).catch(function () {
        return false;
      });
    }

    if ($window.confirm('Are you sure you want to remove this item?')) {
      return remove(uuid);
    }
  };

  $ctrl.getQueue = function () {
    if (fetching) {
      return Promise.resolve();
    }

    fetching = true;
    var oldQueue = $ctrl.draftQueue || [];
    $ctrl.draftQueue.length = 0;
    return bmDraftQueueService.iterate(function (item) {
      $ctrl.draftQueue.push(item);
    }).catch(function () {
      return $ctrl.draftQueue = oldQueue;
    }).then(function () {
      return fetching = false;
    });
  };

  $ctrl.clear = function () {
    return bmDraftQueueService.clear();
  };
}

var draftQueueListComponent = {
  controller: DraftQueueListController,
  controllerAs: 'DraftQueueListCtrl',
  template: '<div class="bm-draft-queue">\n  <ul class="bm-draft-queue__list">\n    <li class="bm-draft-queue__list-item" ng-repeat="item in DraftQueueListCtrl.draftQueue">\n      <a  class="bm-draft-queue__select-item"\n          title="Select item"\n          href=""\n          ng-click="DraftQueueListCtrl.selectItem(item.model)">{{item.form}} - Created at {{item.dateCreated | date:\'hh:mm dd/MMM/y\'}}</a>\n      <a class="bm-draft-queue__remove-item bm-button__icon"\n         href=""\n         title="Remove Item"\n         ng-click="DraftQueueListCtrl.removeItem(item.model._uuid)"\n         ng-bind-html="DraftQueueListCtrl.displayRemove"></a>\n    </li>\n  </ul>\n\n  <a href="" class="bm-draft-queue__clear"\n     ng-click="DraftQueueListCtrl.clear()"> Remove all</a>\n</div>\n',
  bindings: {
    displayRemove: '@?',
    onSelectItem: '&?',
    onRemoveItem: '&?'
  }
};

draftQueueInteceptor.$inject = ['$window', '$q', 'bmDraftQueueService'];
function draftQueueInteceptor($window, $q, bmDraftQueueService) {
  var isPOSTorPUT = function isPOSTorPUT(method) {
    return ['POST', 'PUT'].indexOf(method) > -1;
  };
  var isFormData = function isFormData(contentType) {
    return contentType.toLowerCase().indexOf('application/x-www-form-urlencoded') > -1;
  };
  var isJSONData = function isJSONData(contentType) {
    return contentType.toLowerCase().indexOf('json') > -1;
  };

  var isForm = function isForm(config) {
    return isPOSTorPUT(config.method.toUpperCase()) && (isFormData(config.headers['Content-Type']) || isJSONData(config.headers['Content-Type']));
  };

  return {
    response: function DraftQueueResponse(response) {
      if (!response.config || !isForm(response.config) || !response.config.data || !response.config.data._uuid) {
        return response;
      }

      return bmDraftQueueService.removeItem(response.config.data._uuid).then(function () {
        return response;
      });
    }
  };
}

var draftQueueInterceptor$1 = draftQueueInteceptor;

var uuidService = uuidService_1;
var draftQueueProvider = draftQueueProvider_1;
var draftQueueList = draftQueueListComponent;
var draftQueueInterceptor = draftQueueInterceptor$1;

angular.module('bmDraftQueue', ['LocalForageModule']).config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('bmDraftQueueInterceptor');
}]).provider('bmDraftQueueService', draftQueueProvider).factory('bmDraftQueueInterceptor', draftQueueInterceptor).service('uuidService', uuidService).component('draftQueueList', draftQueueList);

var draftQueueModule = {};

return draftQueueModule;

})));
