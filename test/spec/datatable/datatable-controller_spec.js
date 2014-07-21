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

    beforeEach(module('d2-datatable'));
    beforeEach(inject(function($controller, $rootScope, $q) {
        scope = $rootScope.$new();

        scope.tableData = sampleData;
        scope.tableConfig = {};

        controller = $controller('DataTableController', {
            $scope: scope,
            $q: $q
        });
    }));

    it('should generate the columns from the given data', function () {
        controller.parseTableData(sampleData);

        scope.$apply();

        expect(scope.columns[0].name).toBe('name');
        expect(scope.columns[1].name).toBe('desk');
    });

    it('should not not generate the column names when they are provided', function () {
        scope.tableConfig.columns = sampleHeaders;

        controller.parseTableConfig();
        controller.parseTableData(sampleData);

        scope.$apply();

        expect(scope.columns.length).toBe(1);
        expect(scope.columns[0].name).toBe('desk');
    });

    it('should add a sort field to a column when setSortOrder is called for that column', function () {
        var column = { name: 'HeaderColumnText', sortable: true };
        scope.columns = [column];

        controller.setSortOrder(column);

        expect(scope.columns[0].sort).toBe('asc');
    });

    it('should set sorting to desc when the sorting is asc', function () {
        var column = { name: 'HeaderColumnText', sortable: true, sort: 'asc' };
        scope.columns = [column];

        controller.setSortOrder(column);

        expect(scope.columns[0].sort).toBe('desc');
    });

    it('should set sorting to asc when sorting is desc', function () {
        var column = { name: 'HeaderColumnText', sortable: true, sort: 'desc' };
        scope.columns = [column];

        controller.setSortOrder(column);

        expect(scope.columns[0].sort).toBe('asc');
    });

    it('should set sorting of other columns to undefined when a new column is sorted', function () {
        scope.columns = [
            { name: 'HeaderColumnText', sortable: true, sort: 'asc' },
            { name: 'HeaderColumnTextTwo', sortable: true },
            { name: 'HeaderColumnTextThree', sortable: true }
        ];

        controller.setSortOrder({ name: 'HeaderColumnTextTwo', sortable: true });

        expect(scope.columns[0].sort).not.toBeDefined();
        expect(scope.columns[1].sort).toBe('asc');
        expect(scope.columns[2].sort).not.toBeDefined();
    });

    it('should sort the data given based on the sorting that is set', function () {
        scope.columns = [
            { name: 'name', sortable: true },
            { name: 'desk', sortable: true }
        ];

        controller.parseTableData(sampleData);
        scope.$apply();

        expect(scope.items[0].name).toBe('Mark');

        controller.setSortOrder(scope.columns[0]);
        scope.$digest();

        expect(scope.items[0].name).toBe('Lars');
        expect(scope.items[1].name).toBe('Mark');
        expect(scope.items[2].name).toBe('Morten');
    });

    it('should sort the data in desc order', function () {
        scope.columns = [
            { name: 'name', sortable: true, sort: 'asc' },
            { name: 'desk', sortable: true }
        ];

        controller.parseTableData(sampleData);
        scope.$apply();

        expect(scope.items[0].name).toBe('Mark');

        controller.setSortOrder(scope.columns[0]);
        scope.$digest();

        expect(scope.items[0].name).toBe('Morten');
        expect(scope.items[1].name).toBe('Mark');
        expect(scope.items[2].name).toBe('Lars');
    });

    it('should set localSort to true when the data is an array', function () {
        controller.parseTableData(sampleData);

        expect(controller.localSort).toBe(true);
    });

    it('should set localSort to false when the data is a promise', inject(function ($q) {
        var promise = $q.defer().promise;

        controller.parseTableData(promise)
    }));
});

describe('Controller: Datatable with remote data', function () {
    var scope,
        $httpBackend,
        controller;

    beforeEach(module('d2-rest'));
    beforeEach(module('d2-datatable'));

    beforeEach(inject(function (d2Api, _$httpBackend_, $rootScope, $controller, $q) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();

        $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

        scope.columns = [
                { name: 'name', sortable: true, sort: 'asc' },
                { name: 'code', sortable: true },
                { name: 'lastUpdated' }
        ];

        scope.tableData = d2Api.indicators;

        controller = $controller('DataTableController', {
            $scope: scope,
            $q: $q
        });

        controller.parseTableData();
        $httpBackend.flush();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation ();
        $httpBackend.verifyNoOutstandingRequest ();
    });

    /**
     * TODO: This is coming to 2.17 so we cannot test this yet
     * @see https://blueprints.launchpad.net/dhis2/+spec/webapi-ordering-of-properties
     */
    it('should call the sort method on the service when sorting is changed', function () {
        //$httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);
        //controller.setSortOrder(scope.columns[0]);

        expect(scope.items[0].name).toBe('ANC 1 Coverage');
    });
});
