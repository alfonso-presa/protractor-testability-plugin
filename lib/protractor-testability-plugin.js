/* global browser */
'use strict';

var fs = require('fs');

return {
    name: 'protractor-testability-plugin',
    onPageLoad: function () {
        var testability = fs.readFileSync(require.resolve('testability.js')).toString();
        browser.executeScript('if(!window.testability) {' + testability + '}');
        browser.executeScript(function (customTestability) {
            customTestability = customTestability && JSON.parse(customTestability, function reviver (key, item) {
                return typeof item === 'string' && item.indexOf('var temp=') === 0 ? eval(item): item;// jshint ignore:line
            });

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
                        var testability = customTestability || {};
                        testability.whenStable = testability.whenStable || function (cb) { cb(); };
                        return testability;
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
        }, JSON.stringify(this.config.customFrameworkTestability, function replacer (key, item) {
            return typeof item === 'function' ? 'var temp=' + item.toString() + ';temp;': item;
        }));
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
