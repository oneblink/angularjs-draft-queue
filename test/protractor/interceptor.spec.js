'use strict'

describe('http interceptor tests', () => {
  const expectedFormName = 'testCtrl'
  const expectedText = 'expected text'

  let textbox
  let saveDraftButton
  let sendDraftButton

  let list
  let clearList

  beforeEach(() => {
    return browser.get('http://localhost:8000/test/e2e/index.html')
      .then(() => {
        textbox = element(by.model('$ctrl.model.text'))
        saveDraftButton = element(by.id('save-draft'))
        sendDraftButton = element(by.id('send-draft'))
        list = element.all(by.repeater('item in DraftQueueListCtrl.draftQueue'))
        clearList = element(by.className('bm-draft-queue__clear'))
        clearList.click()
        return browser.waitForAngular()
      })
  })

  it('should automatically remove an item from the draft queue', (done) => {
    textbox.sendKeys(expectedText)
    saveDraftButton.click()
    browser.waitForAngular()
    sendDraftButton.click()

    browser.waitForAngular()
      .then(() => {
        expect(list.count()).toBe(0)
      })
      .then(done)
      .catch(done.fail)
  })
})
