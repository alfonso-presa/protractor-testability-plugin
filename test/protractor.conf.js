exports.config = {
  directConnect: false,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
  },

  // Framework to use. Jasmine 2 is recommended.
  framework: 'jasmine2',

  baseUrl: 'http://localhost:8000',

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['specs/*.spec.js'],

  plugins: [{
    path: '..'
  }],

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};