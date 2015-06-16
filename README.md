# protractor-testability-plugin

This is a WIP - It's pending for https://github.com/angular/protractor/pull/2104 to be released.

This plugins enables testing projects and libraries not built against angularjs in sync with protractor.

## Installation

This will be a lot easier in the future.... right now:

```bash
# CD Into some working dir

git clone https://github.com/sjelin/protractor.git
cd protractor
git checkout plugin-api
npm link

#CD where ever your project is
cd ~/workspace/myproject
npm link protractor

npm install --save-dev protractor-testability-plugin
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
if (testability) {
	testability.wait.for(myPromise);
}
```
You can avoid checking for the testability object everytime if you include it directly on the page.


Also check the test/samples folder of this repo for some working examples.

## License

MIT
