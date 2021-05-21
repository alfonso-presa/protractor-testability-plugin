/*! protractor-testability-plugin - v2.0.2
 *  Release on: 2021-05-21
 *  Copyright (c) 2021 Alfonso Presa
 *  Licensed MIT */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function () {
      return (factory());
    });
  } else if (typeof module === 'object' && module.exports) {
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

return (module.exports = {
    name: 'protractor-testability-plugin',
    onPageLoad: function () {
        var testability = fs.readFileSync(require.resolve('testability.js')).toString();
        var browserInstrumentation = require('testability-browser-bindings');
        var protractorBindings = require('./client/protractor-bindings');

        browser.executeScript('if(!window.testability) {(function(){' +
            testability +
        '}.bind(window))()}');
        browser.executeScript(function (browserInstrumentation) {
            var head = document.getElementsByTagName('head')[0];
            var scriptText='(' + browserInstrumentation + ')();';
            var scriptEl = document.createElement( 'script' );
            scriptEl.type = 'text/javascript';
            scriptEl.textContent = scriptText;
            head.insertBefore( scriptEl, head.firstChild );
        }, browserInstrumentation.toString());
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
                console.log('Error while waiting to sync with the page: ' + JSON.stringify(browserErr));
            }
        });
    }
});


}));
