"use strict";

describe('DHIS 2 Model', function () {

    beforeEach(function () {
       this.addMatchers(jasmine_custom_matchers);
    });

    describe('Model structure', function () {
        var model;

        beforeEach(module('d2-model'));
        beforeEach(inject(function (d2Model) {
            model = new d2Model();
        }));

        it('should have an afterLoad method', function () {
            expect(model).toHaveMethod('afterLoad');
        });

        it('should have a beforeSave method', function () {
            expect(model).toHaveMethod('beforeSave');
        });
    });

});
