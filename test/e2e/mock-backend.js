'use strict';

const pendingQueueDev = angular.module('mockBackend', ['app', 'ngMockE2E']);

pendingQueueDev.run(($httpBackend) => {
  $httpBackend.whenPOST('/url').respond((m, u, d) => {
    const data = angular.fromJson(d);

    return [200, data, {}];
  });
});
