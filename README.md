# protractor-testability-plugin
[![Build Status](https://travis-ci.org/alfonso-presa/protractor-testability-plugin.svg?branch=master)](https://travis-ci.org/alfonso-presa/protractor-testability-plugin)

This plugins enables testing projects and libraries not built against AngularJS services in sync with protractor (without having to set ignoreSynchronization=true). Even when using AngularJS there are situations when this plugin my become useful, like when using webworkers or comunicating via websockets.

This means that your TDD/BDD tests will be a lot cleaner as you will not have to add aditional waitings and tweak timeouts to get your tests passing consistently as protractor will know when there's a task pending and it will wait automatically between each step for it to get completed.

If you're coding a reusable front end library, you definitely should consider notifying testability.js when doing something asynchronous as it will make e2e testing in projects using your library a lot more easy.

## Installation

Execute the following from a command line inside your project:

```bash
npm install --save-dev protractor protractor-testability-plugin
```

Now add this to protractor.conf.js ()

```js
plugins: [{
	package: 'protractor-testability-plugin'
}],
```

## Automatic waits

This plugin will make protractor wait automatically for the following async events:

* Ajax requests
* setTimeout/clearTimeout: only if it's time is below 5 seconds, because otherwise it's considered a timeout.
* setImmediate/clearImmediate
* fetch

## Advanced Usage

Check https://github.com/alfonso-presa/testability.js to see how to make testings frameworks wait for your libraries and applications.

Basically everytime you are doing something asynchronous that is not using angular's $http or $timeout, or is not in the automatic waits, you should do:

```js
testability && testability.wait.for(myPromise);
```
This plugin will include testability.js in the page for you when testing in protractor, but it will not be there in other situations. You can avoid checking for the testability object everytime if you include it directly on the page.

Also check the test/samples folder of this repo for some working examples.

## Map Protractor `browser` methods to any framework

Angular provides a testability object that includes methods like `setLocation(url)`  for Protractor to use as `browser.setLocation(url)`. This plugin allows you to set `customFrameworkTestability` to an object of methods to map them to the framework of your app.
```js
exports.config = {
    plugins: [
        {
            package: 'protractor-testability-plugin',
            customFrameworkTestability: {
                // Methods go here
            }
        }
    ]
};
```

All current Protractor browser methods can be [found here for v4.0.8](https://github.com/angular/protractor/blob/4.0.8/lib/clientsidescripts.js): see all uses of `angular.getTestability()`. If you are not using v4.0.8, check the source code for the version of Protractor you are using. Also try [searching for `getTestability`](https://github.com/angular/protractor/search?utf8=%E2%9C%93&q=getTestability) to see what methods Protractor is trying to use.

Generally, if Protractor errors when you are trying to use a `browser` method in your tests for a non-Angular app, see if the error names a function that is missing: you can then provide that function via `customFrameworkTestability`.

### Example

In a Backbone app, to enable use of `browser.setLocation()` in your tests, include the following with this plugin's configuration:
```js
exports.config = {
    plugins: [
        {
            package: 'protractor-testability-plugin',
            customFrameworkTestability: {
                setLocation: function (route) {
                    Backbone.history.navigate(route, true);
                }
            }
        }
    ]
};
```

## License

MIT
