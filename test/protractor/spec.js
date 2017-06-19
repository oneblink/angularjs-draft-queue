'use strict'

function selectDropdownByNumber(element, index, milliseconds) {
    element.all(by.tagName('option'))
      .then(function(options) {
        options[index].click();
      });
    if (typeof milliseconds !== 'undefined') {
      browser.sleep(milliseconds);
   }
}

describe('Protractor tests', () => {
  let textbox
  let selectbox
  let saveDraftButton
  let lastSaved

  beforeEach(() => {
    browser.get('http://localhost:8000/test/e2e/index.html')

    textbox = element(by.model('$ctrl.model.text'))
    selectbox = element(by.model('$ctrl.model.select'))
    saveDraftButton = element(by.id('save-draft'))

    lastSaved = element(by.id('last-saved'))
  })

  it('should have the required setup', () => {
    expect(textbox.isPresent()).toBe(true)
    expect(selectbox.isPresent()).toBe(true)
  })

  it('should save the model', () => {
    const expectedText = 'expected text'
    textbox.sendKeys(expectedText)
    selectDropdownByNumber(selectbox, 0)

    browser.waitForAngular().then(() => {
      saveDraftButton.click()

      return browser.waitForAngular()
    }).then(() => {
      expect(lastSaved.getText()).not.toBeUndefined()
      expect(lastSaved.getText()).toEqual(jasmine.stringMatching(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/))
    })
  })
})
