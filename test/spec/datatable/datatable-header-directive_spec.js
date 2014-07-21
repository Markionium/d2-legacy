"use strict";

describe('Directive: DataTable Header', function () {
    var element, scope, $compile;

    beforeEach(module('d2-datatable'));
    beforeEach(module('common/datatable/datatable.html'));

    beforeEach(inject(function ($rootScope, _$compile_) {
        $compile = _$compile_;
        scope = $rootScope.$new();

        scope.tableConfig = {};
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText' }
        ];

        scope.tableData = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 },
            { name: "Morten", desk: 3 }
        ];

        element = angular.element('<d2-data-table table-config="tableConfig" table-data="tableData" />');
    }));

    describe('without data', function () {
        var firstHeader;

        beforeEach(function () {
            $compile(element)(scope);
            scope.$digest();

            firstHeader = element.find('th').first();
        });

        it('should add a class to the table header', function () {
            expect(firstHeader.hasClass('table-header')).toBe(true);
        });

        it('should display the content using transclude', function () {
            expect(firstHeader.text()).toBe('HeaderColumnText');
        });

        it('should not give a clickable header when sortable is false', function () {
            expect(firstHeader.find('a').length).toBe(0);
        });

        it('should use a span for the header text when not sortable', function () {
            expect(firstHeader.children().length).toBe(1);
            expect(firstHeader.children().prop("tagName")).toBe('SPAN');
        });
    });

    it('should give a clickable header when sortable is set', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('a').length).toBe(1);
    });

    it('should place the header text in the clickable header', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('a').text()).toBe('HeaderColumnText');
    });

    it('should only have one child when sortable', function () {
        scope.column = {
            sortable: true
        };

        $compile(element)(scope);
        scope.$digest();

        expect(element.children().length).toBe(1);
    });

    it('should call the setSorting method on the parent controller', inject(function () {
        var controller;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('d2DataTable');
        spyOn(controller, 'setSortOrder');

        element.find('th').first().find('a').click();

        expect(controller.setSortOrder.callCount).toBe(1);
    }));

    it('should call the setSorting method with the column data', function () {
        var controller;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('d2DataTable');
        spyOn(controller, 'setSortOrder');

        element.find('th').first().find('a').click();

        expect(controller.setSortOrder).toHaveBeenCalledWith(scope.tableConfig.columns[0]);
    });

    it('should add the asc class when sorting is asc', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'asc' }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('th').first().find('a').hasClass('sorting-asc')).toBe(true);
    });

    it('should add the desc class when sorting is desc', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'desc' }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('th').first().find('a').hasClass('sorting-desc')).toBe(true);
    });

    it('should add the desc class when sorting is desc', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'desc' }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('th').first().find('a').hasClass('sorting-desc')).toBe(true);
    });
});
