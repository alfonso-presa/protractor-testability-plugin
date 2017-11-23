/* global browser */
'use strict';

var fs = require('fs');

return (module.exports = {
    name: 'protractor-testability-plugin',
    onPageLoad: function () {
        var testability = fs.readFileSync(require.resolve('testability.js')).toString();
        var browserInstrumentation = require('testability-browser-bindings');
        var protractorBindings = require('./client/protractor-bindings');

        browser.executeScript('if(!window.testability) {(function(){' +
            testability +
        '}.bind(window))()}');
        browser.executeScript(browserInstrumentation);
        browser.executeScript(
            protractorBindings,
            JSON.stringify(this.config.customFrameworkTestability, function replacer (key, item) {
                return typeof item === 'function' ? 'var temp=' + item.toString() + ';temp;': item;
            })
        );
    },
    waitForPromise: function () {
        return browser.executeAsyncScript(function (cb) {
            return window.testability ?
                window.testability.when.ready(cb):
                cb('Error, testability is not loaded in the browser window :-(.');
        }).then(function (browserErr) {
            if (browserErr) {
                throw 'Error while waiting to sync with the page: ' + JSON.stringify(browserErr);
            }
        });
    }
});
