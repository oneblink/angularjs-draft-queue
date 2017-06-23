'use strict'

describe('Draft Queue Service', () => {
    const expectedFormName = 'test'

    let existingDraft
    let draftQueueProvider
    let interval
    let $rootScope

    beforeEach(() => {
      const date = (new Date()).getTime()
      existingDraft = {
        form: expectedFormName,
        dateCreated: date,
        dateModified: date,
        model: {_uuid: '1234'}
      }

      const fakeModule = angular.module('config', [])
      const LocalForageModule = angular.module('LocalForageModule', [])
      LocalForageModule.service('$localForage', ['$q', function ($q) {
        const service = {
          getItem: () => $q.resolve(existingDraft),
          setItem: (uuid, obj) => $q.resolve(obj),
          removeItem: () => $q.resolve(),
          clear: () => $q.resolve(),
          createInstance: () => service
        }

        return service
      }])

      fakeModule.config((_bmDraftQueueServiceProvider_) => {
        draftQueueProvider = _bmDraftQueueServiceProvider_
      })

      module('bmDraftQueue', 'config', 'LocalForageModule')

      inject((_$rootScope_) => {$rootScope = _$rootScope_})

      interval = triggerDigests($rootScope)
    })

    afterEach(() => {
      stopDigests(interval)
    })

    describe('When not configured', () => {
      it('should throw an error', () => {
        // eslint-disable-next-line no-unused-vars
        expect(() => inject((_bmDraftQueueService_) => {}))
          .toThrowError('You must specify an appName in your applications .config function before using this service')

      })
    })

    describe('When configured', () => {
      let draftQueue
      beforeEach(() => draftQueueProvider.config({appName: 'test'}))

      it('should not throw an error when getting the service', (done) => {
       try {
          inject((_bmDraftQueueService_) => {
            expect(_bmDraftQueueService_).not.toBeUndefined()
            done()
          })
        } catch (e) {
          fail(e)
        }
      })

      describe(', ', () => {
        beforeEach(() => {
          draftQueueProvider.config({appName: 'test'})

          inject((_bmDraftQueueService_) => {
            draftQueue = _bmDraftQueueService_
          })
        })

        it('should exist', () => {
          expect(draftQueue).not.toBeUndefined()
        })

        const methods = ['getItem', 'removeItem', 'clear']
        methods.forEach((method) => {
          it(`${method} should return a promise`, (done) => {
            draftQueue[method]().then(() => done())
          })
        })

        describe('when saving a draft', () => {
          describe('without a _uuid property', () => {
            it('should create a uuid', (done) => {
              draftQueue.setItem({}, 'testForm').then((savedObj) => {
                expect(savedObj.model._uuid).not.toBeUndefined()
                done()
              })
            })

            it('should save meta data about the draft', (done) => {
              const expectedDraft = {}
              draftQueue.setItem(expectedDraft, expectedFormName).then((result) => {
                expect(result.form).toBe(expectedFormName)
                expect(result.dateCreated).not.toBeUndefined()
                expect(result.dateModified).toBe(result.dateCreated)
                expect(result.model).toBe(expectedDraft)
                done()
              })
            })

            it('should broadcast the `bmDraftQueueAdd` event', (done) => {
              const expectedDraft = {}
              $rootScope.$on('bmDraftQueueAdd', (e, result) => {
                expect(result).not.toBeUndefined()
                expect(result.form).toBe(expectedFormName)
                expect(result.dateCreated).not.toBeUndefined()
                expect(result.dateModified).toBe(result.dateCreated)
                expect(result.model).toBe(expectedDraft)
                expect(result.model._uuid).not.toBeUndefined()

                done()
              })
              draftQueue.setItem(expectedDraft, expectedFormName)
            })
          })

          describe('with a _uuid property', () => {
            it('should update an existing draft', (done) => {
              const draft = {_uuid: '1234'}
              draftQueue.setItem(draft, expectedFormName).then((result) => {
                expect(result.form).toBe(expectedFormName)
                expect(result.dateCreated).toBe(existingDraft.dateCreated)
                expect(result.dateModified).not.toBe(existingDraft.dateCreated)
                expect(result.model._uuid).toBe(existingDraft.model._uuid)
                done()
              })
            })

            it('should throw if no parameters are specified', () => {
              expect(draftQueue.setItem).toThrowError('model must be defined')
              expect(() => draftQueue.setItem({test: 'hello'})).toThrowError('formName must be defined')
            })

            it('should broadcast the `bmDraftQueueAdd` event', () => {
              it('should update an existing draft', (done) => {
                const draft = {_uuid: '1234'}
                $rootScope.$on('bmDraftQueueAdd', (e, result) => {
                  expect(result.form).toBe(expectedFormName)
                  expect(result.dateCreated).toBe(existingDraft.dateCreated)
                  expect(result.dateModified).not.toBe(existingDraft.dateCreated)
                  expect(result.model._uuid).toBe(existingDraft.model._uuid)
                  done()
                })

                draftQueue.setItem(draft, expectedFormName)
              })
            })
          })
        })

        describe('when removing a draft', () => {
          xit('should broadcast the `bmDraftQueueRemove` event', (done) => {
            $rootScope.$on('bmDraftQueueRemove', (e, item) => {
              expect(item).not.toBeUndefined()
              done()
            })

            draftQueue.removeItem('xxxx-xxxx')
          })
        })
      })
    })
})
