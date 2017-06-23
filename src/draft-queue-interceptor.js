'use strict'

draftQueueInteceptor.$inject = ['$window', '$q', 'bmDraftQueueService']
function draftQueueInteceptor($window, $q, bmDraftQueueService) {
  const isPOSTorPUT = method => ['POST', 'PUT'].indexOf(method) > -1
  const isFormData = (contentType) => contentType.toLowerCase().indexOf('application/x-www-form-urlencoded') > -1
  const isJSONData = (contentType) => contentType.toLowerCase().indexOf('json') > -1

  const isForm = (config) => isPOSTorPUT(config.method.toUpperCase()) &&
                             (isFormData(config.headers['Content-Type']) || isJSONData(config.headers['Content-Type']))

  return {
    response: function DraftQueueResponse (response) {
      if (!response.config || !isForm(response.config) || !response.config.data || !response.config.data._uuid) {
        return response
      }

      return bmDraftQueueService.removeItem(response.config.data._uuid).then(() => response)
    },
  }
}

module.exports = draftQueueInteceptor
