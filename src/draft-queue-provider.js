'use strict'

function draftQueueProvider () {
  let _dbName = 'blinkDrafts'
  let _appName

  this.config = ({dbName = 'bmDrafts', appName}) => {
    _dbName = dbName
    _appName = appName
  }

  this.$get = ['$rootScope', '$localForage', 'uuidService',
  function ($rootScope, $localForage, uuid) {
    if (angular.isUndefined(_appName)) {
      throw new Error('You must specify an appName in your applications .config function before using this service')
    }
    const lf = $localForage.createInstance({
        name        : _dbName,
        storeName   : _appName,
        description : 'Blink Mobile Draft Queue Storage'
    })

    const createDraft = function (model, formName) {
      const createdDate = (new Date()).getTime()
      const newDraft = {
        model,
        form: formName,
        dateCreated: createdDate,
        dateModified: createdDate
      }

      return newDraft
    }

    const broadcastSaveEvent = function (item) {
      $rootScope.$broadcast('bmDraftQueueAdd', item)

      return item
    }

    const service = {
      setItem: function (model, formName) {
        if (!model) {
          throw new Error('model must be defined')
        }

        if (!formName) {
          throw new Error('formName must be defined')
        }

        if (model._uuid) {
          return lf.getItem(model._uuid).then((data) => {
            // has not been saved as a draft
            if (!data) {
              return lf.setItem(model._uuid, createDraft(model, formName))
                       .then(broadcastSaveEvent)
            }

            // update existing draft
            const updatedDraft = {
              model,
              form: data.form,
              dateCreated: data.dateCreated,
              dateModified: (new Date()).getTime()
            }

            return lf.setItem(model._uuid, updatedDraft)
                     .then(broadcastSaveEvent)
          })
        }

        model._uuid = uuid()
        return lf.setItem(model._uuid, createDraft(model, formName))
                 .then(broadcastSaveEvent)
      },

      getItem: function (uuid) {
        return lf.getItem(uuid)
      },

      removeItem: function (uuid) {
        return lf.removeItem(uuid).then((item) => {
          $rootScope.$broadcast('bmDraftQueueRemove', item)

          return item
        })
      },

      clear: function () {
        return lf.clear()
      },

      iterate: function (iter) {
        return lf.iterate(iter)
      },

      length: function length() {
        return lf.length()
      },

      instance: function () {
        return lf
      }
    }

    return service
  }]
}

module.exports = draftQueueProvider
