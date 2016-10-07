/* global window */
/* exported bindWithProtractor  */
'use strict';

function bindWithProtractor(customTestability) {

    customTestability = customTestability && JSON.parse(customTestability, function reviver (key, item) {
        return typeof item === 'string' && item.indexOf('var temp=') === 0 ? eval(item): item;// jshint ignore:line
    });

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

}

module.exports = bindWithProtractor ;
