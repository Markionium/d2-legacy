describe('Controller: Datatable', function () {
    var scope,
        controller,
        sampleData = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 },
            { name: "Morten", desk: 3 }
        ],
        sampleHeaders = [
            { name: "desk" }
        ];

    beforeEach(module('d2-recordtable'));
    beforeEach(inject(function ($controller, $rootScope, $q) {
        scope = $rootScope.$new();

        scope.tableDataSource = sampleData;
        scope.tableConfig = {};

        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });
    }));

    it('should generate the columns from the given data', function () {
        controller.parseTableData(sampleData);

        scope.$apply();

        expect(scope.tableConfig.columns[0].name).toBe('name');
        expect(scope.tableConfig.columns[1].name).toBe('desk');
    });

    it('should not not generate the column names when they are provided', function () {
        scope.tableConfig.columns = sampleHeaders;

        controller.parseTableConfig();
        controller.parseTableData(sampleData);

        scope.$apply();

        expect(scope.tableConfig.columns.length).toBe(1);
        expect(scope.tableConfig.columns[0].name).toBe('desk');
    });

    it('should add a sort field to a column when setSortOrder is called for that column', function () {
        var column = { name: 'HeaderColumnText', sortable: true };
        scope.tableConfig.columns = [column];

        controller.setSortOrder(column);

        expect(scope.tableConfig.columns[0].sort).toBe('asc');
    });

    it('should set sorting to desc when the sorting is asc', function () {
        var column = { name: 'HeaderColumnText', sortable: true, sort: 'asc' };
        scope.tableConfig.columns = [column];

        controller.setSortOrder(column);

        expect(scope.tableConfig.columns[0].sort).toBe('desc');
    });

    it('should set sorting to asc when sorting is desc', function () {
        var column = { name: 'HeaderColumnText', sortable: true, sort: 'desc' };
        scope.tableConfig.columns = [column];

        controller.setSortOrder(column);

        expect(scope.tableConfig.columns[0].sort).toBe('asc');
    });

    it('should set sorting of other columns to undefined when a new column is sorted', function () {
        scope.tableConfig.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'asc' },
            { name: 'HeaderColumnTextTwo', sortable: true },
            { name: 'HeaderColumnTextThree', sortable: true }
        ];

        controller.setSortOrder({ name: 'HeaderColumnTextTwo', sortable: true });

        expect(scope.tableConfig.columns[0].sort).not.toBeDefined();
        expect(scope.tableConfig.columns[1].sort).toBe('asc');
        expect(scope.tableConfig.columns[2].sort).not.toBeDefined();
    });

    it('should sort the data given based on the sorting that is set', function () {
        scope.tableConfig.columns = [
            { name: 'name', sortable: true },
            { name: 'desk', sortable: true }
        ];

        controller.parseTableData(sampleData);
        scope.$apply();

        expect(scope.tableData.items[0].name).toBe('Mark');

        controller.setSortOrder(scope.tableConfig.columns[0]);
        scope.$digest();

        expect(scope.tableData.items[0].name).toBe('Lars');
        expect(scope.tableData.items[1].name).toBe('Mark');
        expect(scope.tableData.items[2].name).toBe('Morten');
    });

    it('should sort the data in desc order', function () {
        scope.tableConfig.columns = [
            { name: 'name', sortable: true },
            { name: 'desk', sortable: true }
        ];

        controller.parseTableData(sampleData);
        scope.$apply();

        expect(scope.tableData.items[0].name).toBe('Mark');

        controller.setSortOrder(scope.tableConfig.columns[0]);
        controller.setSortOrder(scope.tableConfig.columns[0]);
        scope.$digest();

        expect(scope.tableData.items[0].name).toBe('Morten');
        expect(scope.tableData.items[1].name).toBe('Mark');
        expect(scope.tableData.items[2].name).toBe('Lars');
    });

    it('should set localData to true when the data is an array', function () {
        controller.parseTableData(sampleData);

        expect(controller.localData).toBe(true);
    });

    it('should set localData to false when the data is a promise', inject(function ($q) {
        var promise = $q.defer().promise;

        controller.parseTableData(promise)
    }));

    it('should filter the local data based on the filters given', function () {
        scope.tableConfig.columns = [
            { "name": "name", "searchable": true, "filter": "Ma" },
            { "name": "desk", "searchable": true}
        ];

        controller.parseTableConfig();
        controller.parseTableData();
        scope.$apply();

        controller.doLocalFiltering();

        expect(scope.tableData.items.length).toBe(1);
        expect(scope.tableData.items[0].name).toBe('Mark');
    });

    it('should save the original data in the origData property on the controller', function () {
        controller.parseTableData();
        scope.$apply();

        expect(controller.origData).toEqual(scope.tableDataSource);
    });

    it('should do local filtering when a filter is changed', function () {
        controller.parseTableData();
        scope.$digest();

        //Add spies after initializing the data because we call local filtering
        //when the data is added to ensure filtering when the data is changed.
        spyOn(controller, 'doLocalFiltering');
        spyOn(controller, 'getRemoteParams');

        scope.tableConfig.columns[0].filter = 'M';
        scope.$digest();

        expect(controller.doLocalFiltering).toHaveBeenCalledOnce();
        expect(controller.getRemoteParams).not.toHaveBeenCalled();
    });

    it('should call the remote filtering when data is not local', function () {
        //Fake that the data is a d2-rest service
        scope.tableDataSource.getList = function () {
            return sampleData
        };

        controller.parseTableData();
        applyScope(scope);

        //Register spies after loading the data to get the right callcount
        spyOn(controller, 'doLocalFiltering');
        spyOn(controller, 'requestNewDataFromService').andCallThrough();

        scope.tableConfig.columns[0].filter = 'M';
        applyScope(scope);

        expect(controller.doLocalFiltering).not.toHaveBeenCalled();
        expect(controller.requestNewDataFromService).toHaveBeenCalledOnce();
    });

    it('should request the remote params when a filter is changed', inject(function ($timeout) {
        //Fake that the data is a d2-rest service
        scope.tableDataSource.getList = function () {
            return sampleData
        };
        controller.parseTableData();
        applyScope(scope);

        //Register spies after loading the data to get the right callcount
        spyOn(controller, 'getRemoteParams');
        spyOn(controller, 'requestNewDataFromService').andCallThrough();

        scope.tableConfig.columns[0].filter = 'M';
        applyScope(scope);

        expect(controller.requestNewDataFromService).toHaveBeenCalledOnce();
        expect(controller.getRemoteParams).toHaveBeenCalledOnce();
    }));

    it('should return an array of values for a column', function () {
        var expectedValues = ['Mark', 'Lars', 'Morten'],
            actualValues;

        controller.parseTableData();
        applyScope(scope);

        actualValues = controller.getValuesForColumn(scope.tableConfig.columns[0]);

        expect(actualValues).toEqual(expectedValues);
    });

    it('should return an empty array when asking for a column that doesnt exist', function () {
        var expectedValues = [],
            actualValues;

        controller.parseTableData();
        applyScope(scope);

        actualValues = controller.getValuesForColumn();

        expect(actualValues).toEqual(expectedValues);
    });

    it('should return an empty array when asking for a column name that is not a string', function () {
        var expectedValues = [],
            actualValues;

        controller.parseTableData();
        applyScope(scope);

        actualValues = controller.getValuesForColumn({ name: {} });

        expect(actualValues).toEqual(expectedValues);
    });
});

describe('Controller: Datatable with remote data', function () {
    var scope,
        $httpBackend,
        controller;

    beforeEach(module('d2-rest'));
    beforeEach(module('d2-recordtable'));

    beforeEach(inject(function (d2Api, _$httpBackend_, $rootScope, $controller, $q, $timeout) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();

        $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

        scope.tableConfig = {};
        scope.tableConfig.columns = [
            { name: 'name', sortable: true, sort: 'asc', searchable: true },
            { name: 'code', sortable: true },
            { name: 'lastUpdated' }
        ];

        scope.tableDataSource = d2Api.indicators;

        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });

        spyOn(controller, 'processMetaData').andCallThrough();

        controller.parseTableData();
        $timeout.flush();
        $httpBackend.flush();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    /**
     * TODO: This is coming to 2.17 so we cannot test this yet
     * @see https://blueprints.launchpad.net/dhis2/+spec/webapi-ordering-of-properties
     */
    it('should call the sort method on the service when sorting is changed', function () {
        expect(scope.tableData.items[0].name).toBe('ANC 1 Coverage');
    });


    it('should call the service with the filters', function () {
        $httpBackend.expectGET('/dhis/api/indicators?filter=name:like:anc').respond(200, []);

        scope.tableConfig.columns[0].filter = 'anc';
        applyScope(scope);

        $httpBackend.flush();
    });

    it('should have the filtered data on the scope', function () {
        $httpBackend.expectGET('/dhis/api/indicators?filter=name:like:anc')
            .respond(200, fixtures.api.indicators.filteredOnAnc);

        scope.tableConfig.columns[0].filter = 'anc';
        applyScope(scope);

        $httpBackend.flush();

        expect(scope.tableData.items.length).toBe(15);
    });

    it('should request data with empty string (box-cleared)', function () {
        $httpBackend.expectGET('/dhis/api/indicators?filter=name:like:anc')
            .respond(200, fixtures.api.indicators.filteredOnAnc);

        scope.tableConfig.columns[0].filter = 'anc';
        applyScope(scope);
        $httpBackend.flush();

        expect(scope.tableData.items.length).toBe(15);

        $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);
        scope.tableConfig.columns[0].filter = '';
        applyScope(scope);
        $httpBackend.flush();

        expect(scope.tableData.items.length).toBe(50);
    });

    describe('page switcher', function () {
        it('should do a call to the api when a page is switched', function () {
            $httpBackend.expectGET('/dhis/api/indicators?page=2').respond(200, fixtures.api.indicators.page2);
            controller.pager.currentPage = 2;
            scope.$apply();
            $httpBackend.flush();
        });

        it('should not add the page param on the first page', function () {
            $httpBackend.expectGET('/dhis/api/indicators?page=2').respond(200, fixtures.api.indicators.page2);
            controller.pager.currentPage = 2;
            $httpBackend.flush();

            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);
            controller.pager.currentPage = 1;
            $httpBackend.flush();
        });
    });

    describe('timer function', function () {
        var $timeout;

        beforeEach(inject(function (_$timeout_) {
            $timeout = _$timeout_;
        }));

        it('should only call the service once if the user types', function () {
            spyOn(controller, 'requestNewDataFromService').andCallThrough();

            $httpBackend.expectGET('/dhis/api/indicators?filter=name:like:anc')
                .respond(200, fixtures.api.indicators.filteredOnAnc);

            scope.tableConfig.columns[0].filter = 'a';
            applyScope(scope, 0);
            scope.tableConfig.columns[0].filter = 'an';
            applyScope(scope, 150);
            scope.tableConfig.columns[0].filter = 'anc';
            applyScope(scope, 150);

            $httpBackend.flush();

            expect(controller.requestNewDataFromService).toHaveBeenCalledOnce();
        });
    });

    it('should add typeahead values to the cache', function () {
        expect(controller.typeAheadCache.name.length).toBe(50);
    });

    it('should not remove old values when the list is filtered', function () {
        $httpBackend.expectGET('/dhis/api/indicators?filter=name:like:anc')
            .respond(200, []);

        scope.tableConfig.columns[0].filter = 'anc';
        applyScope(scope);

        $httpBackend.flush();

        expect(scope.tableData.items.length).toBe(0);
        expect(controller.typeAheadCache.name.length).toBe(50);
    });
});

describe('Controller: Datatable generation of headers', function () {
    var scope, controller, $httpBackend;

    beforeEach(module('d2-rest'));
    beforeEach(module('d2-recordtable'));

    beforeEach(inject(function (d2Api, _$httpBackend_, $rootScope, $controller, $q) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();

        $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

        scope.tableDataSource = d2Api.indicators;

        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });
    }));

    it('should not reload the headers every time data is received from the service', function () {
        spyOn(controller, 'getHeadersFromData').andCallThrough();

        controller.parseTableData();
        $httpBackend.flush();

        $httpBackend.expectGET('/dhis/api/indicators?filter=name:like:anc')
            .respond(200, fixtures.api.indicators.filteredOnAnc);

        scope.tableConfig.columns[2].searchable = true;
        scope.tableConfig.columns[2].filter = 'anc';
        flushTime();

        $httpBackend.flush();

        expect(controller.getHeadersFromData).toHaveBeenCalledOnce();
    });
});

describe('Controller: Datatable selectable', function () {
    var scope, controller, $httpBackend;

    beforeEach(module('d2-rest'));
    beforeEach(module('d2-recordtable'));

    beforeEach(inject(function (d2Api, $rootScope, $controller, $q) {
        scope = $rootScope.$new();

        scope.tableData = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 },
            { name: "Morten", desk: 3 }
        ];

        scope.tableConfig ={};

        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });
    }));

    describe('isSelectable', function () {
        beforeEach(function () {
            scope.tableConfig.select = true;
            controller.processData(scope.tableData);
        });

        it('should return true when tableConfig.select is true', function () {
            expect(controller.isSelectable()).toBe(true);
        });

        it('should return false when tableConfig.select is false', function () {
            scope.tableConfig.select = false;

            expect(controller.isSelectable()).toBe(false);
        });

        it('should return false when tableConfig.select is not available', function () {
            delete scope.tableConfig;

            expect(controller.isSelectable()).toBe(false);
        });
    });

    describe('addSelectable', function () {
        beforeEach(function () {
            scope.tableConfig.select = true;
            controller.processData(scope.tableData);
        });

        it('should add a column for the checkboxes to the column list', function () {
            expect(scope.tableConfig.columns.length).toBe(3);
        });

        it('should give the column header an empty name', function () {
            expect(scope.tableConfig.columns[0].name).toBe('');
        });

        it('should add a property checkbox to the added column', function () {
            expect(scope.tableConfig.columns[0].checkbox).toBeDefined();
        });

        it('should give the added property checkbox the value true', function () {
            expect(scope.tableConfig.columns[0].checkbox).toBe(true);
        });

        it('should add a selected property onto the items', function () {
            expect(scope.tableData.items[0].selected).toBe(false);
        });

        it('should only add the select box once', function () {
            controller.addSelectable();

            expect(scope.tableConfig.columns.length).toBe(3);
        });
    });

    describe('getRowDataColumns', function () {
        beforeEach(function () {
            scope.tableConfig.select = false;
        });

        it('should return all the available columns', function () {
            controller.processData(scope.tableData);
            expect(controller.getRowDataColumns().length).toBe(2);
        });

        it('should return the data only columns without the selectable', function () {
            scope.tableConfig.select = true;
            controller.processData(scope.tableData);

            expect(controller.getRowDataColumns().length).toBe(2);
        });
    });

    describe('selectAll', function () {
        beforeEach(function () {
            scope.tableConfig.select = false;
            controller.processData(scope.tableData);
        });
        it('should set all the items to selected', function () {
            controller.selectAll();

            expect(scope.tableData.items[0].selected).toBe(true);
            expect(scope.tableData.items[1].selected).toBe(true);
            expect(scope.tableData.items[2].selected).toBe(true);
        });
        it('should set all the items to unselected when they are all selected', function () {
            controller.selectAll();
            controller.selectAll();

            expect(scope.tableData.items[0].selected).toBe(false);
            expect(scope.tableData.items[1].selected).toBe(false);
            expect(scope.tableData.items[2].selected).toBe(false);
        });

        it('should set all to selected when not all items are selected', function () {
            scope.tableData.items[1].selected;

            controller.selectAll();

            expect(scope.tableData.items[0].selected).toBe(true);
            expect(scope.tableData.items[1].selected).toBe(true);
            expect(scope.tableData.items[2].selected).toBe(true);
        });

        it('should set allSelected on the controller to true when calling selectAll', function () {
            controller.selectAll();

            expect(controller.allSelected).toBe(true);
        });

        it('should set allSelected to false when a single item is unselected', function () {
            controller.selectAll();

            scope.tableData.items[1].selected = false;
            controller.checkAllSelected();

            expect(controller.allSelected).toBe(false);
        });

        it('should emit an event when the selection changed', function () {
            var eventHandler = jasmine.createSpy();

            scope.$on('RECORDTABLE.selection.changed', eventHandler);
            controller.selectAll();

            expect(eventHandler).toHaveBeenCalled();
        });

        //TODO: Check if the data was passed to the handler
//        it('should pass all the items to the eventHandler', function () {
//            var eventHandler = jasmine.createSpy();
//
//            scope.$on('RECORDTABLE.selection.changed', eventHandler);
//            controller.selectAll();
//
//            expect(eventHandler).toHaveBeenCalledWith(scope.tableData.items);
//        });
    });

    describe('isAllSelected', function () {
        beforeEach(function () {
            scope.tableConfig.select = false;
            controller.processData(scope.tableData);
        });

        it('should return true when all items are selected', function () {
            scope.tableData.items[0].selected = true;
            scope.tableData.items[1].selected = true;
            scope.tableData.items[2].selected = true;

            expect(controller.isAllSelected()).toBe(true);
        });

        it('should return false when some items are selected', function () {
            scope.tableData.items[0].selected = false;
            scope.tableData.items[1].selected = true;
            scope.tableData.items[2].selected = true;

            expect(controller.isAllSelected()).toBe(false);
        });

        it('should return false when no items are selected', function () {
            scope.tableData.items[0].selected = false;
            scope.tableData.items[1].selected = false;
            scope.tableData.items[2].selected = false;

            expect(controller.isAllSelected()).toBe(false);
        });
    });

    describe('checkAllSelected', function () {
        beforeEach(function () {
            scope.tableConfig.select = false;
            controller.processData(scope.tableData);

            scope.tableData.items[0].selected = true;
            scope.tableData.items[1].selected = true;
            scope.tableData.items[2].selected = true;
        });

        it('should set allSelected to false when not all items are selected', function () {
            scope.tableData.items[0].selected = false;
            controller.allSelected = true;

            controller.checkAllSelected();

            expect(controller.allSelected).toBe(false);
        });

        it('should set allSelected to true when all items are selected', function () {
            controller.allSelected = false;

            controller.checkAllSelected();

            expect(controller.allSelected).toBe(true);
        });

        it('should emit an event when the selection changed', function () {
            var eventHandler = jasmine.createSpy();

            scope.$on('RECORDTABLE.selection.changed', eventHandler);
            controller.checkAllSelected();

            expect(eventHandler).toHaveBeenCalled();
        });
    });

    describe('getSelectedItems', function () {
        beforeEach(function () {
            scope.tableConfig.select = false;
            controller.processData(scope.tableData);

            scope.tableData.items[0].selected = true;
            scope.tableData.items[1].selected = true;
            scope.tableData.items[2].selected = true;
        });

        it('should return the selected items', function () {
            expect(controller.getSelectedItems().length).toBe(3);
        });

        it('should return only the items that are selected', function () {
            scope.tableData.items[1].selected = false;

            expect(controller.getSelectedItems().length).toBe(2);
            expect(controller.getSelectedItems()[0].name).toBe('Mark');
            expect(controller.getSelectedItems()[1].name).toBe('Morten');
        });
    });

    describe('resetAllSelected', function () {
        beforeEach(function () {
            scope.tableConfig.select = true;
            controller.processData(scope.tableData);

            controller.allSelected = true;
        });

        it('should reset the all selected back to false when the datasource is changed', function () {
            controller.processData(scope.tableData);

            expect(controller.allSelected).toBe(false);
        });

        it('should reset the all selected back to false after the event is called', function () {
            scope.$broadcast('RECORDTABLE.selection.clear');

            expect(controller.allSelected).toBe(false);
        });

        it('should set the selected property on all items to false', function () {
            scope.tableData.items[0].selected = true;
            scope.tableData.items[1].selected = true;
            scope.tableData.items[2].selected = true;

            scope.$broadcast('RECORDTABLE.selection.clear');

            expect(scope.tableData.items[0].selected).toBe(false);
            expect(scope.tableData.items[1].selected).toBe(false);
            expect(scope.tableData.items[2].selected).toBe(false);
        });
    });

    describe('reseting filter', function () {
        beforeEach(function () {
            scope.tableConfig.columns = [
                { name: 'name', sortable: true, searchable: true },
                { name: 'code', sortable: true }
            ];

            scope.tableDataSource = [
                { name: "Mark", desk: 1 },
                { name: "Lars", desk: 2 },
                { name: "Morten", desk: 3 }
            ];

            controller.parseTableConfig();
            controller.parseTableData();
            scope.$digest();

            scope.tableConfig.columns[0].filter = 'M';
            scope.$digest();
        });

        it('Should not mark all selected after removing filtering', function () {
            controller.selectAll();

            expect(controller.getItems().length).toBe(2);
            expect(controller.getSelectedItems().length).toBe(2);

            //Remove filter
            scope.tableConfig.columns[0].filter = '';
            scope.$apply();

            expect(controller.getItems().length).toBe(3);
            expect(controller.getSelectedItems().length).toBe(2);
            expect(controller.allSelected).toBe(false);
        });
    });
});
