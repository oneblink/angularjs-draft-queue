'use strict'

describe('DRAFT QUEUE INTERCEPTOR,', () => {
  let draftQueueProvider
  let bmDraftQueueInterceptor
  let bmDraftQueueService
  let $rootScope
  let $q
  let interval

  beforeEach(() => {
    const fakeModule = angular.module('config', [])
    const LocalForageModule = angular.module('LocalForageModule', [])
    LocalForageModule.service('$localForage', ['$q', function ($q) {
      const service = {
        getItem: () => $q.resolve({}),
        setItem: (uuid, obj) => $q.resolve(obj),
        removeItem: () => $q.resolve(),
        clear: () => $q.resolve(),
        createInstance: () => service
      }

      return service
    }])

    fakeModule.config((_bmDraftQueueServiceProvider_) => {
      draftQueueProvider = _bmDraftQueueServiceProvider_
      draftQueueProvider.config({appName: 'test'})
    })

    module('bmDraftQueue', 'config', 'LocalForageModule')

    inject((_bmDraftQueueInterceptor_, _bmDraftQueueService_, _$rootScope_, _$q_ ) => {
      bmDraftQueueInterceptor = _bmDraftQueueInterceptor_
      $rootScope = _$rootScope_
      $q = _$q_
      bmDraftQueueService = _bmDraftQueueService_
    })

    interval = triggerDigests($rootScope)
  })

  afterEach(() => {
    stopDigests(interval)
  })

  it('should exist', () => {
    expect(bmDraftQueueInterceptor).not.toBeFalsy()
  })

  describe('when a response', () => {
    describe('is a form submission,', () => {
      describe('and was successfully submitted', () => {
        beforeEach(() => {
          spyOn(bmDraftQueueService, 'removeItem').and.returnValue($q.resolve())
        })

        afterEach(() => {
          bmDraftQueueService.removeItem.calls.reset()
        })

        it('should remove the item from the Draft queue', (done) => {
          const response = {
            status: 200,
            statusText: '200 OK',
            config: {
              data: { _uuid: 'uuid' },
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }
            },
            data: 'data returned from server'
          }

          bmDraftQueueInterceptor.response(response)
            .then(() => expect(bmDraftQueueService.removeItem).toHaveBeenCalledWith('uuid'))
            .then(done)
            .catch(done.fail)
        })
      })
    })
  })
})
