# protractor-testability-plugin

This is a WIP - It's pending for https://github.com/angular/protractor/pull/2104 to be released and some other protractor improvements.

Make projects and libraries not built against angularjs work in sync with protractor.

## Installation

This will be a lot easier in the future.... right now:

```bash
# CD Into some working dir

git clone https://github.com/sjelin/protractor.git
cd protractor
git checkout plugin-api
npm link

cd ..
git clone https://github.com/alfonso-presa/protractor-testability-plugin.git
cd protractor-testability-plugin
npm link

#CD where ever your project is
cd ~/workspace/myproject
npm link protractor
npm link protractor-testability-plugin
```

Now add this to protractor.conf.js ()

```js
plugins: [{
	path: 'node_modules/protractor-testability-plugin'
}],
```

## Usage

Check https://github.com/alfonso-presa/testability.js to see how to make testings frameworks wait for your libraries and applications.

## License

MIT
