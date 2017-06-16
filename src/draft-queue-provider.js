'use strict'

function draftQueueProvider () {
  let _dbName = 'blinkDrafts'
  let _appName

  this.config = ({dbName = 'bmDrafts', appName}) => {
    _dbName = dbName
    _appName = appName
  }

  this.$get = ['$localForage', 'uuidService', function ($localForage, uuid) {
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

    const service = {
      setItem: function (model, formName) {
        if (model._uuid) {
          return lf.getItem(model._uuid).then((data) => {
            // has not been saved as a draft
            if (!data) {
              return lf.setItem(model._uuid, createDraft(model, formName))
            }

            // update existing draft
            const updatedDraft = {
              model,
              form: data.form,
              dateCreated: data.dateCreated,
              dateModified: (new Date()).getTime()
            }

            return lf.setItem(model._uuid, updatedDraft)
          })
        }

        model._uuid = uuid()
        return lf.setItem(model._uuid, createDraft(model, formName))
      },

      getItem: function (uuid) {
        return lf.getItem(uuid)
      },

      removeItem: function (uuid) {
        return lf.removeItem(uuid)
      },

      clear: function () {
        return lf.clear()
      },

      instance: function () {
        return lf
      }
    }

    return service
  }]
}

module.exports = draftQueueProvider
