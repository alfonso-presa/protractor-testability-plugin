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
  specs: ['specs/testability.spec.js'],

  plugins: [{
    path: '..',
    customFrameworkTestability: {
        whenStable: function (cb) {
            var log = document.createElement('div');
            log.id = 'stableLog';
            log.innerHTML = 'whenStable Called!!';
            document.getElementsByTagName('body')[0].appendChild(log);
            cb();
        }
    }
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
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin Firefox',
      specs: ['specs/*.spec.js']
    }, {
      'browserName': 'chrome',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin Chrome',
      specs: ['specs/*.spec.js']
    }, {
      'browserName': 'safari',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin Safari'
    }, {
      'browserName': 'internet explorer',
      'version': '10',
      build: process.env.TRAVIS_BUILD_NUMBER,
      'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
      name: 'protractor-testability-plugin IE10'
    },, {
        'browserName': 'MicrosoftEdge',
        build: process.env.TRAVIS_BUILD_NUMBER,
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        name: 'protractor-testability-plugin Edge'
      }];
}
else {
    config.multiCapabilities= [{
      'browserName': 'firefox',
      name: 'protractor-testability-plugin Firefox'
    }, {
      'browserName': 'chrome',
      name: 'protractor-testability-plugin Chrome'
    }];
}

exports.config = config;
