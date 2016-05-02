var config = {
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

  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};

if (process.env.TRAVIS_BUILD_NUMBER){
  config.multiCapabilities= [{
      'browserName': 'firefox',
      'version': '28',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin Firefox'
    }, {
      'browserName': 'chrome',
      'version': '34',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin Chrome'
    }, {
      'browserName': 'safari',
      'version': '8',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin Safari'
    }, {
      'browserName': 'internet explorer',
      'version': '10',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin IE10'
    }];
}
else {
    config.multiCapabilities= [{
      'browserName': 'firefox',
      'version': '28',
      name: 'protractor-testability-plugin Firefox'
    }, {
      'browserName': 'chrome',
      'version': '34',
      name: 'protractor-testability-plugin Chrome'
    }];
}

exports.config = config;
