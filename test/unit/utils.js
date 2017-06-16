'use strict'

function triggerDigests($rootScope) { // eslint-disable-line no-unused-vars
  return setInterval(function() {
    $rootScope.$apply()
  }, 50)
}

function stopDigests(interval) { // eslint-disable-line no-unused-vars
  window.clearInterval(interval)
}
