'use strict'

describe('draft queue list controller', () => {
  let $componentController
  let $rootScope
  let $q
  let $sce
  let mockLocalForage // eslint-disable-line
  let locals
  let interval

  mockLocalForage = angular.module('LocalForageModule', [])
  beforeEach(module('LocalForageModule'))
  beforeEach(module('bmDraftQueue'))
  beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _$sce_) {
    $componentController = _$componentController_
    $rootScope = _$rootScope_
    $rootScope = _$rootScope_
    $q = _$q_
    $sce = _$sce_
    locals = {
      $scope: $rootScope.$new(),
      $q: $q,
      $sce: $sce
    }

    interval = triggerDigests($rootScope)
  }))

  afterEach(() => {
    stopDigests(interval)
  })

  it('it should set the default public properties', () => {
    const expectedQueue = 'one'

    locals.$window = {confirm: () => true},
    locals.bmDraftQueueService = {
      iterate: (cb) => Promise.resolve(cb(expectedQueue))
    }
    const $ctrl = $componentController('draftQueueList', locals)
    $ctrl.$onInit()
    expect($ctrl.draftQueue).toEqual([expectedQueue])
    expect($sce.getTrustedHtml($ctrl.displayRemove)).toBe('&#x2718;')
    expect(locals.$scope)
  })

  it('should listen for draft queue events', () => {
    const expectedQueue = 'one'

    locals.$window = {confirm: () => true},
    locals.bmDraftQueueService = {
      iterate: (cb) => Promise.resolve(cb(expectedQueue))
    }
    const $ctrl = $componentController('draftQueueList', locals)
    const $onSpy = spyOn(locals.$scope, '$on').and.callThrough()
    $ctrl.$onInit()
    expect($onSpy).toHaveBeenCalledTimes(2)
    $ctrl.$onDestroy()
  })

  it('should not lose the pending queue if there is a problem getting from storage', () => {
    const expectedQueue = 'one'
    const iterateSpy = jasmine.createSpy().and.returnValues(
      Promise.resolve(),
      Promise.reject())

    locals.$window = {confirm: () => true},
    locals.bmDraftQueueService = {
      iterate: iterateSpy
    }

    const $ctrl = $componentController('draftQueueList', locals)

    $ctrl.draftQueue = [expectedQueue]
    $ctrl.getQueue()
      .then(() => {
        expect(iterateSpy.toHaveBeenCalledTimes(2))
        expect($ctrl.draftQueue).toEqual([expectedQueue])
      })
  })

  it('should remove an item from the draft queue', () => {
    const expectedQueue = 'one'
    const removeItemSpy = jasmine.createSpy().and.returnValue(Promise.resolve())

    locals.$window = {confirm: () => true},
    locals.bmDraftQueueService = {
      iterate: (cb) => Promise.resolve(cb(expectedQueue)),
      removeItem: removeItemSpy
    }

    const $ctrl = $componentController('draftQueueList', locals)
    $ctrl.$onInit()

    $ctrl.removeItem('xxx')

    expect(removeItemSpy).toHaveBeenCalled()
  })

  it('should call custom code for removal dialogue customisation', (done) => {
    const fakeEntry = {_uuid: '1234'}
    const removeItemSpy = jasmine.createSpy().and.returnValue(Promise.resolve())

    locals.$window = {confirm: () => true},
    locals.bmDraftQueueService = {
      iterate: (cb) => Promise.resolve(cb(fakeEntry)),
      removeItem: removeItemSpy,
      getItem: () => Promise.resolve(fakeEntry)
    }

    const bindings = {
      onRemoveItem: () => Promise.resolve()
    }

    const onRemoveSpy = spyOn(bindings, 'onRemoveItem').and.callThrough()

    const $ctrl = $componentController('draftQueueList', locals, bindings)
    $ctrl.$onInit()
    $ctrl.removeItem('xxx')
      .then(() => {
        expect(onRemoveSpy).toHaveBeenCalled()
        expect(removeItemSpy).toHaveBeenCalled()
      })
      .then(done)
  })

  it('should call custom code for item selection customisation', () => {
    const fakeEntry = {_uuid: '1234'}

    locals.$window = {confirm: () => true},
    locals.bmDraftQueueService = {
      iterate: (cb) => Promise.resolve(cb(fakeEntry)),
      getItem: () => Promise.resolve(fakeEntry)
    }

    const bindings = {
      onSelectItem: () => Promise.resolve()
    }

    const onSelectSpy = spyOn(bindings, 'onSelectItem').and.callThrough()

    const $ctrl = $componentController('draftQueueList', locals, bindings)
    $ctrl.$onInit()
    $ctrl.selectItem('xxx')

    expect(onSelectSpy).toHaveBeenCalled()
  })

})
