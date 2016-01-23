# protractor-testability-plugin
[![Build Status](https://travis-ci.org/alfonso-presa/protractor-testability-plugin.svg?branch=master)](https://travis-ci.org/alfonso-presa/protractor-testability-plugin)

This plugins enables testing projects and libraries not built against AngularJS services in sync with protractor (without having to set ignoreSynchronization=true). Even when using AngularJS there are situations when this plugin my become useful, like when using webworkers or comunicating via websockets.

This means that your TDD/BDD tests will be a lot cleaner as you will not have to add aditional waitings and tweak timeouts to get your tests passing consistently as protractor will know when there's a task pending and it will wait automatically between each step for it to get completed.

Ofcourse this is not magical and when coding the applications or libraries you should notify testability.js about the pending task providing it a promise.

If you're coding a reusable front end library, you definitely should consider notifying testability.js when doing something asynchronous as it will make e2e testing in projects using your library a lot more easy.

## Installation

Execute the following from a command line inside your project:

```bash
npm install --save-dev protractor protractor-testability-plugin
```

Now add this to protractor.conf.js ()

```js
plugins: [{
	path: 'node_modules/protractor-testability-plugin'
}],
```

## Usage

Check https://github.com/alfonso-presa/testability.js to see how to make testings frameworks wait for your libraries and applications.

Basically everytime you are doing something asynchronous that is not using angular's $http or $timeout you should do:

```js
testability && testability.wait.for(myPromise);
```
This plugin will include testability.js in the page for you when testing in protractor, but it will not be there in other situations. You can avoid checking for the testability object everytime if you include it directly on the page.

Also check the test/samples folder of this repo for some working examples.

## Automatic waits

This plugin will make protractor wait automatically for the following async events:

* JQuery ajax requests
* setTimeout/clearTimeout, setInterval/clearInterval: only if it's time is below 5 secconds, because otherwise it's considered a timeout.
* setImmediate/clearImmediate


## License

MIT
