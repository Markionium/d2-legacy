describe('Directive: recordtable', function () {
    beforeEach(module('ui.bootstrap.tpls'));
    beforeEach(module('ui.bootstrap.pagination'));
    beforeEach(module('d2-recordtable'));
    beforeEach(module('d2-rest'));
    beforeEach(module('d2-filters'));
    beforeEach(module('common/recordtable/recordtable.html'));

    describe('recordtable', function () {
        var element, scope;

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

            element = angular.element('<record-table table-config="tableConfig" table-data="tableData" />');
        }));

        describe('structure', function () {
            beforeEach(inject(function ($compile) {
                $compile(element)(scope);
                scope.$digest();
            }));

            it('should compile', function () {
                expect(element).toHaveClass('record-table');
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

                expect(firstHeader.text()).toBe('name');
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

            describe('table should add a div for pagination', function () {
                var paginationWrap;

                beforeEach(function () {
                    paginationWrap = element.find('.record-table-pagination');
                });

                it('should only have one element for pagination', function () {
                    expect(paginationWrap.length).toBe(1);
                });

                it('should have one ul element for the pagination', function () {
                    expect(paginationWrap.find('ul').length).toBe(1);
                });
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
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
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

        describe('pagination', function () {
            var scope,
                $httpBackend,
                $rootScope,
                paginationElement,
                controller;

            beforeEach(inject(function (d2Api, _$httpBackend_, _$rootScope_, $compile) {
                $httpBackend = _$httpBackend_;
                $rootScope = _$rootScope_;
                scope = $rootScope.$new();

                $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

                scope.tableConfig = {};
                scope.tableData = d2Api.indicators;

                $compile(element)(scope);
                scope.$digest();

                paginationElement = element.find('table').next().first();
                controller = element.controller('recordTable');

                $httpBackend.flush();
            }));

            afterEach(function () {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should wrap the pagination in a div with a class record-table-pagination', function () {
                expect(paginationElement).toHaveClass('record-table-pagination')
            });

            it('should display the pagination in the footer', function () {
                expect(paginationElement.children().first().prop('tagName')).toBe('UL');
            });

            it('should add two page links', function () {
                expect(paginationElement.find('li').length).toBe(6);
            });

            it('should display the next button correctly', function () {
                var nextButton = $(paginationElement.find('li')[4]);

                expect(nextButton.text()).toBe('Next');
            });

            it('should add colspan for the ')
        });
    });

    describe('Directive: recordtable', function () {
        var element, scope, d2Api;

        beforeEach(inject(function ($rootScope, $compile, _d2Api_) {
            var tableConfig = {};

            d2Api = _d2Api_;
            scope = $rootScope.$new();

            scope.tableConfig = tableConfig;

            element = angular.element('<record-table table-config="tableConfig" table-data="tableData" />');

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should add the data when it becomes available', inject(function ($httpBackend) {
            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);
            expect(element.find('tbody tr').length).toBe(0);

            scope.tableData = d2Api.indicators;
            $httpBackend.flush();

            expect(element.find('tbody tr').length).toBe(50);
        }));
    });

    describe('Directive: record interaction', function () {
        var element, scope, d2Api;

        beforeEach(inject(function ($rootScope, $compile, _d2Api_) {
            var tableConfig = {
                rowClick: jasmine.createSpy()
            };

            d2Api = _d2Api_;
            scope = $rootScope.$new();

            scope.tableConfig = tableConfig;
            scope.tableData = [
                { name: "Mark", desk: 1 },
                { name: "Lars", desk: 2 },
                { name: "Morten", desk: 3 }
            ];


            element = angular.element('<record-table table-config="tableConfig" table-data="tableData" />');

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should call rowClick function on the config when clicking a row', function () {
            element.find('tbody tr').first().click();

            expect(scope.tableConfig.rowClick).toHaveBeenCalledOnce();
        });

        it('should pass the item to the rowclick function', function () {
            element.find('tbody tr').first().click();

            expect(scope.tableConfig.rowClick).toHaveBeenCalledWith(scope.tableData[0]);
        });
    });

    describe('Directive: selectable rows', function () {
        var element, scope, d2Api;

        beforeEach(inject(function ($rootScope, $compile, _d2Api_) {
            var tableConfig = {
                rowClick: jasmine.createSpy()
            };

            d2Api = _d2Api_;
            scope = $rootScope.$new();

            scope.tableConfig = tableConfig;
            scope.tableConfig.select = true;

            scope.tableData = [
                { name: "Mark", desk: 1 },
                { name: "Lars", desk: 2 },
                { name: "Morten", desk: 3 }
            ];


            element = angular.element('<record-table table-config="tableConfig" table-data="tableData" />');

            $compile(element)(scope);
            scope.$digest();
        }));

        it('should add a checkbox for each of the items', function () {
            var rowsFirstCells = element.find('tbody tr td:first-child input[type=checkbox]');
            expect(rowsFirstCells.length).toBe(3);
        });
    });
});