"use strict";
describe('Filter: "no" translate', function () {
    var translateFilter;

    beforeEach(module('d2-filters'));
    beforeEach(inject(function (_translateFilter_) {
        translateFilter = _translateFilter_;
    }));

    it('should capitalize the input', function () {
        expect(translateFilter('text')).toBe('Text');
    });

    it('should return undefined when undefined is given', function () {
        expect(translateFilter(undefined)).toBe(undefined);
    });

    it('should return an object when an object is passed', function () {
        expect(translateFilter({})).toEqual({});
    });
});
