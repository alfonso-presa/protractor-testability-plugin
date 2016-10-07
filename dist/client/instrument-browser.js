/* global window, testability */
/* exported instrumentBrowser */
'use strict';

function instrumentBrowser() {
    var setTimeout = window.setTimeout;

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
}

module.exports = instrumentBrowser;
