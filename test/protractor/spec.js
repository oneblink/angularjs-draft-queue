'use strict'

const EC = protractor.ExpectedConditions

function selectDropdownByNumber(element, index) {
  return element.all(by.tagName('option'))
    .then(function(options) {
      options[index].click();
    })
}

describe('Protractor tests', () => {
  const expectedFormName = 'testCtrl'
  const expectedText = 'expected text'
  const expectedSelectValue = 'Select 1'

  let textbox
  let selectbox
  let saveDraftButton
  let lastSaved

  // update elements
  let updatedTextbox
  let updatedSelectbox
  let updatedDateCreated
  let updatedDateModified
  let updatedFormName

  beforeEach(() => {
    browser.get('http://localhost:8000/test/e2e/index.html')

    textbox = element(by.model('$ctrl.model.text'))
    selectbox = element(by.model('$ctrl.model.select'))
    saveDraftButton = element(by.id('save-draft'))

    updatedTextbox = element(by.model('$ctrl.draftItem.model.text'))
    updatedSelectbox = element(by.model('$ctrl.draftItem.model.select'))
    updatedDateCreated = element(by.model('$ctrl.draftItem.dateCreated'))
    updatedDateModified = element(by.model('$ctrl.draftItem.dateModified'))
    updatedFormName = element(by.model('$ctrl.draftItem.form'))

    lastSaved = element(by.id('last-saved'))
  })

  it('should have the required setup', () => {
    expect(textbox.isPresent()).toBe(true)
    expect(selectbox.isPresent()).toBe(true)
  })

  it('should save the model', (done) => {
    const expectedText = 'expected text'
    textbox.sendKeys(expectedText)
    selectDropdownByNumber(selectbox, 1)
      .then(() => browser.waitForAngular())
      .then(() => saveDraftButton.click())
      .then(() => browser.waitForAngular())
      .then(() => {
        const options = updatedSelectbox.all(by.tagName('option'))

        expect(lastSaved.getText()).not.toBeUndefined()
        expect(lastSaved.getText()).toEqual(jasmine.stringMatching(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/))
        EC.textToBePresentInElementValue(updatedTextbox, expectedText)
        expect(options.count()).toBe(2)
        expect(options.first().isSelected()).toBe(true)
        expect(options.first().getText()).toBe(expectedSelectValue)
        expect(updatedDateCreated).not.toBeUndefined()
        EC.textToBePresentInElementValue(updatedFormName, expectedFormName)
      })
      .then(() => updatedDateCreated.getAttribute('value').then((created) => {
        return updatedDateModified.getAttribute('value').then((updated) => expect(updated).toBe(created))
      }))
      .then(done)
  })

  it('should update the model', (done) => {
    const newText = 'abracadabra'
    let originalUUID

    textbox.sendKeys(expectedText)
    selectDropdownByNumber(selectbox, 1, 100)
      .then(() => browser.waitForAngular())
      .then(() => saveDraftButton.click())
      .then(() => browser.waitForAngular())
      .then(() => lastSaved.getText().then((uuid) => (originalUUID = uuid)))
      .then(() => textbox.clear())
      .then(() => browser.waitForAngular())
      .then(() => browser.sleep(1000))
      .then(() => textbox.sendKeys(newText))
      .then(() => browser.waitForAngular())
      .then(() => saveDraftButton.click())
      .then(() => browser.waitForAngular())
      .then(() => {
        const options = updatedSelectbox.all(by.tagName('option'))

        expect(lastSaved.getText()).not.toBeUndefined()
        expect(lastSaved.getText()).toBe(originalUUID)
        expect(lastSaved.getText()).toEqual(jasmine.stringMatching(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/))
        EC.textToBePresentInElementValue(updatedTextbox, newText)
        expect(options.count()).toBe(2)
        expect(options.first().isSelected()).toBe(true)
        expect(updatedDateCreated).not.toBeUndefined()
        EC.textToBePresentInElementValue(updatedFormName, expectedFormName)
      })
      .then(() => updatedDateCreated.getAttribute('value').then((created) => {
        return updatedDateModified.getAttribute('value').then((updated) => {
          expect((new Date(updated).getTime()) > (new Date(created)).getTime()).toBe(true)
        })
      }))
      .then(done)
  })
})
