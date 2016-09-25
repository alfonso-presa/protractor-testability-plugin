/*! protractor-testability-plugin - v1.1.0
 *  Release on: 2016-09-25
 *  Copyright (c) 2016 Alfonso Presa
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

/* global browser */
'use strict';

var fs = require('fs');

return {
    name: 'protractor-testability-plugin',
    onPageLoad: function () {
        var testability = fs.readFileSync(require.resolve('testability.js')).toString();
        browser.executeScript('if(!window.testability) {' + testability + '}');
        browser.executeScript(function () {
            var setTimeout = window.setTimeout;

            if (!window.angular) {
                // TODO: This is very very very (very^n) dirty...
                // but the only way right now to make protractor work without setting ignoreSynchronization.
                window.angular = {
                    resumeBootstrap: function () { },
                    module: function () {
                        return {
                            config: function () { return this; }
                        };
                    },
                    getTestability: function () {
                        // Allow users to set their own testability objects to
                        // map anything Angular provides for Protractor to the
                        // framework they're using.
                        var whenStableDefault = function (cb) { cb(); };
                        var customAngularTestability = window.customAngularTestability;
                        if (customAngularTestability) {
                            // Allow setting custom whenStable of any value if
                            // it's assigned. If not assigned, use default.
                            // The user may want to set whenStable to anything,
                            // even falsey, for testing reasons, so they should
                            // be allowed to do so.
                            if (typeof customAngularTestability.whenStable === 'undefined') {
                                customAngularTestability.whenStable = whenStableDefault;
                            }
                            return customAngularTestability;
                        }
                        return {
                            whenStable: whenStableDefault
                        };
                    }
                };

                window.getAllAngularTestabilities = function () {
                    return [window.angular.getTestability()];
                };
            }

            function patchFunction(set, clear, filterTime) {
                var setFn = window[set];
                var clearFn = window[clear];

                var sets = {};

                window[set] = function () {
                    var cb = arguments[0];
                    var ref;
                    var time = arguments[1];
                    arguments[0] = function () {
                        sets[ref] = undefined;
                        if (!filterTime || time < 5000) {
                            setTimeout(window.testability.wait.oneLess());
                        }
                        cb.apply(window, arguments);
                    };
                    ref = setFn.apply(window, arguments);
                    if (!filterTime || time < 5000) {
                        window.testability.wait.oneMore();
                        sets[ref] = true;
                    }
                    return ref;
                };

                window[clear] = function () {
                    if (sets[arguments[0]]) {
                        setTimeout(window.testability.wait.oneLess());
                        sets[arguments[0]] = undefined;
                    }
                    return clearFn.apply(window, arguments);
                };
            }

            function patchPromiseFunction(set) {
                var setFn = window[set];

                window[set] = function () {
                    var ref;

                    ref = setFn.apply(window, arguments);

                    ref.then(function (result) {
                        setTimeout(window.testability.wait.oneLess());
                        return result;
                    });

                    window.testability.wait.oneMore();

                    return ref;
                };
            }

            patchFunction('setTimeout', 'clearTimeout', true);
            patchFunction('setInterval', 'clearInterval', true);
            patchFunction('setImmediate', 'clearImmediate', false);

            var oldOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
                if(window.testability) {
                    testability.wait.oneMore();
                    this.addEventListener('readystatechange', function () {
                        if (this.readyState === 4) {
                            setTimeout(testability.wait.oneLess());
                        }
                    }, false);
                }
                oldOpen.call(this, method, url, async, user, pass);
            };

            patchPromiseFunction('fetch');
        });
    },
    waitForPromise: function () {
        return browser.executeAsyncScript(
            'return window.testability && window.testability.when.ready.apply(null,arguments)')
            .then(function (browserErr) {
                if (browserErr) {
                    throw 'Error while waiting to sync with the page: ' + JSON.stringify(browserErr);
                }
            });
    }

};


}));
