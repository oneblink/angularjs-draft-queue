'use strict'

describe('List Component tests', () => {
  let textbox
  let saveDraftButton
  let newDraftButton

  let listComponent
  let list
  let clearList

  beforeEach(() => {
    browser.get('http://localhost:8000/test/e2e/index.html')

    textbox = element(by.model('$ctrl.model.text'))
    saveDraftButton = element(by.id('save-draft'))
    newDraftButton = element(by.id('new-draft'))
    listComponent = element(by.tagName('draft-queue-list'))
    list = element.all(by.repeater('item in DraftQueueListCtrl.draftQueue'))
    clearList = element(by.className('bm-draft-queue__clear'))
    clearList.click()

    browser.waitForAngular()
  })

  it('should exist', () => {
    expect(listComponent).not.toBeUndefined()
  })

  it('should show the right number of items', () => {
    expect(list.count()).toBe(0)
    textbox.sendKeys('abc')
      .then(() => saveDraftButton.click())
      .then(() => browser.waitForAngular())
      .then(() => expect(list.count()).toBe(1))
  })

  it('should remove an entry', () => {
     textbox.sendKeys('abc')
      .then(() => saveDraftButton.click())
      .then(() => newDraftButton.click())
      .then(() => textbox.sendKeys('i should be here'))
      .then(() => saveDraftButton.click())
      .then(() => browser.waitForAngular())
      .then(() => expect(list.count()).toBe(2))
      .then(() => {
        const item = element(by.repeater('item in DraftQueueListCtrl.draftQueue')
                            .row(1))
        const removeBtn = item.element(by.className('bm-draft-queue__remove-item'))
        return removeBtn.click()
      })
      .then(() => browser.switchTo().alert().accept())
      .then(() => browser.waitForAngular())
      .then(() => expect(list.count()).toBe(1))

  })
})
