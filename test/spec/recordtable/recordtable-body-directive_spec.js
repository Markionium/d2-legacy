describe('Directive: Record table row directive', function () {
    var element;
    var scope;

    beforeEach(module('d2-recordtable'));
    beforeEach(inject(function ($compile, $rootScope, $controller, $q) {
        element = angular.element('<tbody record-table-body></tbody>');
        scope = $rootScope.$new();

        scope.tableConfig = {};
        scope.tableConfig.columns = [
            { name: 'desk' },
            { name: 'name' }
        ];
        scope.tableDataSource = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 },
            { name: "Morten", desk: 3 }
        ];
        var controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });

        element.data('$recordTableController', controller);
        $compile(element)(scope);
        scope.$digest();

        controller.parseTableConfig();
        controller.parseTableData();
        scope.$apply();
    }));

    it('should replace the element with a TR element', function () {
        expect(element.prop('tagName')).toBe('TBODY');
    });

    it('should add a row for each of the items defined', function () {
        expect(element.children().length).toBe(3);
    });

    it('should add a column for each of the properties in the items', function () {
        var firstRowTDs = element.children().first().children();
        expect(firstRowTDs.length).toBe(2);
    });

    it('should add the data for the item', function () {
        var firstRowTDs = element.children().first().children();
        scope.$apply();

        expect(firstRowTDs.first().html()).toBe('1');
        expect(firstRowTDs.last().html()).toBe('Mark');
    });

    it('should update the table when the data changes', function () {
        window.mark = 1;
        var rowElements;
        scope.tableData.items = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 }
        ];
        scope.$apply();

        rowElements = element.children();

        expect(rowElements.length).toBe(2);
    });
});

describe('record interaction', function () {
    var element, scope, controller, $parse;

    beforeEach(module('d2-recordtable'));
    beforeEach(inject(function ($compile, $rootScope, $controller, $q, _$parse_) {
        $parse = _$parse_;

        element = angular.element('<tbody record-table-body></tbody>');
        scope = $rootScope.$new();

        scope.tableConfig = {
            rowClick: jasmine.createSpy()
        };
        scope.tableConfig.columns = [
            { name: 'desk' },
            { name: 'name' }
        ];
        scope.tableConfig.select = true;

        scope.tableDataSource = [
            { name: "Mark", desk: 1 },
            { name: "Lars", desk: 2 },
            { name: "Morten", desk: 3 }
        ];
        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });

        element.data('$recordTableController', controller);
        $compile(element)(scope);
        scope.$digest();

        controller.parseTableConfig();
        controller.parseTableData();
        scope.$apply();
    }));

    it('should call rowClick function on the config when clicking a row', function () {
        var locals = {
            recordTable: controller
        };
        $parse(element.find('tr').first().attr('ng-click'))(locals);

        expect(scope.tableConfig.rowClick).toHaveBeenCalledOnce();
    });

    it('should pass the item to the rowclick function', function () {
        var locals = {
            recordTable: controller
        };
        $parse(element.find('tr').first().attr('ng-click'))(locals);

        expect(scope.tableConfig.rowClick).toHaveBeenCalledWith(scope.tableData[0]);
    });

    it('should add a checkbox for each of the items', function () {
        var rowsFirstCells = element.find('tr td:first-child input[type=checkbox]');
        expect(rowsFirstCells.length).toBe(3);
    });
});
