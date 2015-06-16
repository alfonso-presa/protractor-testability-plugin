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
