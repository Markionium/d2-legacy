"use strict";
describe('Filter: capitalize', function () {
    var capitalizeFilter;

    beforeEach(module('d2-filters'));
    beforeEach(inject(function (_capitalizeFilter_) {
        capitalizeFilter = _capitalizeFilter_;
    }));

    it('should return undefined on undefined input', function(  ) {
        expect(capitalizeFilter(undefined)).toBe(undefined);
    });

    it('should return a captalized text when a string is given ', function () {
        expect(capitalizeFilter('name')).toBe('Name');
    });

    it('should return the value when a non string value is passed', function () {
        var object = {},
            array = [],
            fa = function () {};

        expect(capitalizeFilter(object)).toBe(object);
        expect(capitalizeFilter(array)).toBe(array);
        expect(capitalizeFilter(fa)).toBe(fa);
    });
});