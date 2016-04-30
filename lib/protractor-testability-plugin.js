/* global browser */
'use strict';

var fs = require('fs');

return {
    name: 'protractor-testability-plugin',
    onPageLoad: function () {
        var testability = fs.readFileSync(require.resolve('testability.js')).toString();
        browser.executeScript('if(!window.testability) {' + testability + '}');
        browser.executeScript(function () {
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
                        return {
                            whenStable: function (cb) { cb(); }
                        };
                    }
                };
            }
            function onload() {
                if (window.$) {
                    window.$.ajaxStart(window.testability.wait.oneMore);
                    window.$.ajaxStop(window.testability.wait.oneLess);
                }
            }

            if (window.addEventListener) {
                window.addEventListener('onload', onload);
            }
            else {
                window.attachEvent('load', onload);
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
                            window.testability.wait.oneLess();
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
                        window.testability.wait.oneLess();
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
                        window.testability.wait.oneLess();
                        return result;
                    });

                    window.testability.wait.oneMore();

                    return ref;
                };
            }

            patchFunction('setTimeout', 'clearTimeout', true);
            patchFunction('setInterval', 'clearInterval', true);
            patchFunction('setImmediate', 'clearImmediate', false);

            patchPromiseFunction('fetch');
        });
    },
    waitForPromise: function () {
        var scriptPromise;
        if (this.config.readyFor) {
            scriptPromise = browser.executeAsyncScript('return testability.when.readyFor.apply(testability.when,arguments)', this.config.readyFor);
        } else {
            scriptPromise = browser.executeAsyncScript('return testability.when.ready.apply(null,arguments)');
        }

        return scriptPromise.then(function (browserErr) {
                if (browserErr) {
                    throw 'Error while waiting to sync with the page: ' + JSON.stringify(browserErr);
                }
            });
    }

};
