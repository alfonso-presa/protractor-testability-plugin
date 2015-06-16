/*! protractor-testability-plugin - v0.1.1
 *  Release on: 2015-06-16
 *  Copyright (c) 2015 Alfonso Presa
 *  Licensed MIT */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    factory();
  }
}(this, function () {

'use strict';

var fs = require('fs');

return {
    name: 'protractor-testability-plugin',
    onPageLoad: function () {
        var testability = fs.readFileSync('node_modules/testability.js/dist/testability.js').toString();
        browser.executeScript(testability);
        browser.executeScript(function () {
            if(!window.angular) {
                // TODO: This is very very very (very^n) dirty...
                // but the only way right now to make protractor work without setting ignoreSynchronization.
                window.angular = {
                    resumeBootstrap: function() {},
                    module: function (){
                        return {
                            config: function () {return this;}
                        };
                    },
                    element: function () {
                        return {
                            injector: function () {
                                return {
                                    get: function (s) {
                                        if(s === '$browser') {
                                            return {
                                                notifyWhenNoOutstandingRequests: function (callback) {
                                                    callback();
                                                }
                                            };
                                        }
                                    }
                                };
                            }
                        };
                    }
                };
            }
        });
    },
    waitForPromise: function () {
        return browser.executeAsyncScript(
                'return testability.when.ready.apply(null,arguments)')
            .then(function(browserErr) {
                if (browserErr) {
                  throw 'Error while waiting to sync with the page: ' + JSON.stringify(browserErr);
            }
        });
    }

};


}));
