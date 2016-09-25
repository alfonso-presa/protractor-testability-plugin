'use strict';

describe('protractor-testability-plugin', function () {

	describe('sample', function () {

		beforeEach(function () {
			browser.get('/test/samples/setTimeout.html');
		});

		it('should wait for stable testability.js when running plain old javascript', function () {
			element(by.id('work')).click();
			expect(element(by.id('placeholder')).getText()).toBe('done!!');
            expect(element(by.id('stableLog')).getText()).toBe('whenStable Called!!');
		});
	});

	describe('ajax jquery sample', function () {

		beforeEach(function () {
			browser.get('/test/samples/restCallJQuery.html');
		});

		it('should wait for stable testability.js when running ajax requests with JQuery automatically', function () {
			element(by.id('work')).click();
			expect(element(by.id('placeholder')).getText()).toBe('done!!');
		});
	});

	describe('in angular sample', function () {

		beforeEach(function () {
			browser.get('/test/samples/setTimeoutWithAngular.html');
		});

		it('should wait for stable testability.js when running plain old javascript', function () {
			element(by.id('work')).click();
			expect(element(by.id('placeholder')).getText()).toBe('done!!');
		});

		it('should wait for stable testability.js when running angular', function () {
			element(by.id('angular-work')).click();
			expect(element(by.id('angular-placeholder')).getText()).toBe('angular done!!');
		});

		it('should wait for stable testability.js when running angular and plain old js in paralel', function () {
			element(by.id('angular-work')).click();
			expect(element(by.id('angular-placeholder')).getText()).toBe('angular done!!');
			expect(element(by.id('placeholder')).getText()).toBe('done!!');
		});

		it('should wait for stable testability.js when running angular and plain old js in secuence', function () {
			element(by.id('angular-seq-work')).click();
			expect(element(by.id('angular-placeholder')).getText()).toBe('angular done!!');
			expect(element(by.id('placeholder')).getText()).toBe('done!!');
		});
	});
});
