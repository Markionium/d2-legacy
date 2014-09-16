"use strict";

describe('Directive: RecordTable Header', function () {
    var element, scope, $compile;

    beforeEach(module('d2-recordtable'));
    beforeEach(module('common/recordtable/recordtable.html'));

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

        element = angular.element('<record-table table-config="tableConfig" table-data="tableData" />');
    }));

    describe('without data', function () {
        var firstHeader;

        beforeEach(function () {
            $compile(element)(scope);
            scope.$digest();

            firstHeader = element.find('th').first();
        });

        it('should add a class to the table header', function () {
            expect(firstHeader).toHaveClass('table-header');
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

        expect(element.find('thead a').length).toBe(1);
    });

    it('should place the header text in the clickable header', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('thead a').text()).toBe('HeaderColumnText');
    });

    it('should only have one table element when sortable', function () {
        scope.column = {
            sortable: true
        };

        $compile(element)(scope);
        scope.$digest();

        expect(element.children('table').length).toBe(1);
    });

    it('should call the setSorting method on the parent controller', inject(function () {
        var controller;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('recordTable');
        spyOn(controller, 'setSortOrder');

        element.find('th').first().find('a').click();

        expect(controller.setSortOrder).toHaveBeenCalledOnce();
    }));

    it('should call the setSorting method with the column data', function () {
        var controller;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('recordTable');
        spyOn(controller, 'setSortOrder');

        element.find('th').first().find('a').click();

        expect(controller.setSortOrder).toHaveBeenCalledWith(scope.tableConfig.columns[0]);
    });

    it('should add the asc class when sorting is asc', function () {
        var firstColumnLinkElement;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'asc' }
        ];

        $compile(element)(scope);
        scope.$digest();
        firstColumnLinkElement = element.find('th').first().find('a');

        expect(firstColumnLinkElement).toHaveClass('sorting-asc');
    });

    it('should add the desc class when sorting is desc', function () {
        var firstColumnLinkElement;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'desc' }
        ];

        $compile(element)(scope);
        scope.$digest();
        firstColumnLinkElement = element.find('th').first().find('a');

        expect(firstColumnLinkElement).toHaveClass('sorting-desc');
    });

    it('should add the desc class when sorting is desc', function () {
        var firstColumnLinkElement;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'desc' }
        ];

        $compile(element)(scope);
        scope.$digest();
        firstColumnLinkElement = element.find('th').first().find('a');

        expect(firstColumnLinkElement).toHaveClass('sorting-desc');
    });

    it('should display a searchbox if searchable is on', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', searchable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        expect(element.find('th').first().find('input').length).toBe(1);
    });

    it('should call the change method when text is added to the search', function () {
        var controller;

        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', searchable: true }
        ];

        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('recordTable');
        spyOn(controller, 'doLocalFiltering');

        element.find('th').first().find('input').change();

        expect(controller.doLocalFiltering).toHaveBeenCalledOnce();
    });

    describe('cosmetics', function () {
        var firstHeader;

        beforeEach(function () {
            scope.tableConfig.headerInputClass = 'form-control',

            scope.tableConfig.columns = [
                { name: 'HeaderColumnText', searchable: true }
            ];

            $compile(element)(scope);
            scope.$digest();

            firstHeader = element.find('th').first();
        });

        it('should add the class that was given', function () {
            expect(firstHeader.find('input')).toHaveClass('form-control');
        });
    });
});

describe('Directive: RecordTable Header', function () {
    var element;
    var scope;

    beforeEach(module('d2-recordtable'));
    beforeEach(module('common/recordtable/recordtable.html'));
    beforeEach(inject(function ($rootScope, _$compile_) {
        $compile = _$compile_;
        scope = $rootScope.$new();

        scope.tableConfig = {
            select: true
        };
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText' }
        ];

        scope.tableData = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 },
            { name: "Morten", desk: 3 }
        ];

        element = angular.element('<record-table table-config="tableConfig" table-data="tableData" />');
        element = $compile(element)(scope);
        scope.$digest();
    }));

    it('should only display the checkbox field', function () {
        var checkBox = element.find('th').first().find('input');

        expect(checkBox.attr('type')).toBe('checkbox');
    });
});
