'use strict';

describe('protractor-testability-plugin', function () {

    describe('fetch sample', function () {

            beforeEach(function () {
                browser.get('/test/samples/fetch.html');
            });

            it('should wait for stable testability.js when running fetch', function () {
                element(by.id('work')).click();
                expect(element(by.id('placeholder')).getText()).toBe('done!!');
            });
    });
});
