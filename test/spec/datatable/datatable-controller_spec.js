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
});
