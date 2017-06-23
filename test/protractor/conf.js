let SpecReporter = require('jasmine-spec-reporter').SpecReporter;

exports.config = {
  framework: 'jasmine',
  specs: ['service.spec.js', 'component.spec.js'],
  multiCapabilities: [
    {
      browserName: 'chrome'
    }
  ],

  jasmineNodeOpts: {
    print: function() {}
  },

  onPrepare: function() {
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true
        }
      })
    );
  }
};
