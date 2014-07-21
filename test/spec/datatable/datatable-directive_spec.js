"use strict";
describe('Directive: datatable', function () {
    var element, scope;

    beforeEach(module('d2-datatable'));
    beforeEach(module('d2-rest'));
    beforeEach(module('common/datatable/datatable.html'));

    beforeEach(inject(function ($rootScope) {
        var tableConfig = {},
            tableData = [
                { name: "Mark", desk: 1 },
                { name: "Lars", desk: 2 },
                { name: "Morten", desk: 3 }
            ];

        scope = $rootScope.$new();

        scope.tableConfig = tableConfig;
        scope.tableData = tableData;

        element = angular.element('<d2-data-table table-config="tableConfig" table-data="tableData" />');
    }));

    describe('structure', function () {
        beforeEach(inject(function ($compile) {
            $compile(element)(scope);
            scope.$digest();
        }));

        it('should compile', function () {
            expect(element.hasClass('d2-data-table')).toBe(true);
        });

        it('should create an isolate scope', function () {
            expect(element.isolateScope()).not.toBe(undefined);
        });

        it('should add a table as a child', function () {
            var table = element.find('table');

            expect(table.length).toBe(1);
        });

        it('should add a table head for the headers <thead>', function () {
            var tableHead = element.find('thead');

            expect(tableHead.length).toBe(1);
        });

        it('should put the thead in the table as the first child', function () {
            var table = element.find('table'),
                tableHeadNode = element.find('thead').get(0);

            expect(table.children().first().get(0)).toBe(tableHeadNode);
        });

        it('should add one table body <tbody>', function () {
            var tableBody = element.find('tbody');

            expect(tableBody.length).toBe(1);
        });

        it('should add the table body after the thead', function () {
            var tableHead = element.find('thead'),
                tableBodyNode = element.find('tbody').get(0);

            expect(tableHead.next().get(0)).toBe(tableBodyNode);
        });

        it('should only add th header columns', function () {
            var tableHead = element.find('thead'),
                headerRow = tableHead.children(),
                thHeaders = tableHead.find('th');

            expect(headerRow.length).toBe(1);
            expect(headerRow.children().length).toBe(thHeaders.length);
        });

        it('should add a header row for the name', function () {
            var tableHead = element.find('thead'),
                headers = tableHead.children(),
                firstHeader = headers.first().children().first();

            expect(firstHeader.text()).toBe('Name');
        });

        it('should add a column header for each of the keys in the data objects', function () {
            var tableHeaderRow = element.find('thead tr'),
                headers = tableHeaderRow.children();

            expect(headers.length).toBe(2);
        });

        it('should add a user row for each user', function () {
            var tableBodyRows = element.find('table tbody tr');

            expect(tableBodyRows.length).toBe(3);
        });

        it('should add a value td for each of the columns', function () {
            var tableBodyRows = element.find('table tbody tr'),
                firstTableBodyRowValues = tableBodyRows.first().children();

            expect(firstTableBodyRowValues.length).toBe(2);
        });

        it('should add the correct values to the correct columns', function () {
            var tableBodyRows = element.find('table tbody tr'),
                firstTableBodyRowValues = tableBodyRows.first().children();

            expect(firstTableBodyRowValues.first().text()).toBe('Mark');
            expect(firstTableBodyRowValues.last().text()).toBe('1');
        });
    });

    describe('configuration', function () {
        var $compile;

        beforeEach(inject(function (_$compile_) {
            $compile = _$compile_;
        }));

        it('should only show the right amount of items when the pageItems param is set', function () {
            var tableBodyRows;

            scope.tableConfig.pageItems = 2;

            $compile(element)(scope);
            scope.$digest();

            tableBodyRows = element.find('table tbody tr');

            expect(tableBodyRows.length).toBe(2);
        });

        it('should not throw an error when tableData is undefined', function () {
            scope.tableConfig = undefined;

            $compile(element)(scope);
            scope.$digest();
        });

        it('should generate the columns based on the data if no columns have been predefined', function () {
            var tableHeaderRow, headers;

            scope.tableConfig.columns = undefined;

            $compile(element)(scope);
            scope.$digest();

            tableHeaderRow = element.find('thead tr');
            headers = tableHeaderRow.children('th');

            expect(tableHeaderRow.length).toBe(1);
            expect(headers.length).toBe(2);
        });
    });

    describe('remote data', function () {
        var scope,
            $httpBackend;

        beforeEach(inject(function (d2Api, _$httpBackend_, $rootScope, $compile) {
            $httpBackend = _$httpBackend_;
            scope = $rootScope.$new();

            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

            scope.tableConfig = {};
            scope.tableData = d2Api.indicators;

            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation ();
            $httpBackend.verifyNoOutstandingRequest ();
        });

        it('it should display the returned amount of elements as rows', function () {
            var tableDataRows;
            $httpBackend.flush();

            tableDataRows = element.find('table tbody tr');

            expect(tableDataRows.length).toBe(50);
        });

        it('should not display the restangular elements as headers', function () {
            var tableHeaderRow, headers;
            $httpBackend.flush();

            tableHeaderRow = element.find('thead tr');
            headers = tableHeaderRow.children();

            expect(headers.length).toBe(5);
        });
    });
});
