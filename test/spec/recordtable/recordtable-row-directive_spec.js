//describe('Directive: Record table row directive', function () {
//    var element;
//    var scope;
//    var createRecordTableControllerMock = function ($scope) {
//        var controller = {
//            items: $scope.items,
//
//            selectAll: function () {
//                return function () {
//                    _.each(this.items, function (item) {
//                        item.selected = true;
//                    });
//                };
//            }
//        };
//
//        spyOn(controller, 'selectAll');
//
//        return controller;
//    };
//
//    beforeEach(module('d2-recordtable'));
//    beforeEach(inject(function ($compile, $rootScope) {
//        element = angular.element('<tbody record-table-rows></tbody>');
//        //element.data('$recordTableController', createRecordTableControllerMock(scope));
//        scope = $rootScope.$new();
//
//        scope.tableConfig = {};
//        scope.tableConfig.columns = [
//            { name: 'desk' },
//            { name: 'name' }
//        ];
//        scope.items = [
//            { name: "Mark", desk: 1 },
//            { name: "Lars", desk: 2 },
//            { name: "Morten", desk: 3 }
//        ];
//
//        $compile(element)(scope);
//        scope.$digest();
//
//        element = $compile(element)(scope);
//    }));
//
//    it('should replace the element with a TR element', function () {
//        expect(element.prop('tagName')).toBe('TBODY');
//    });
//
//    it('should add a row for each of the items defined', function () {
//        expect(element.children().length).toBe(3);
//    });
//
//    it('should add a column for each of the properties in the items', function () {
//        var firstRowTDs = element.children().first().children();
//        expect(firstRowTDs.length).toBe(2);
//    });
//
//    it('should add the data for the item', function () {
//        var firstRowTDs = element.children().first().children();
//        scope.$apply();
//
//        expect(firstRowTDs.first().html()).toBe('1');
//        expect(firstRowTDs.last().html()).toBe('Mark');
//    });
//
//    it('should update the table when the data changes', function () {
//        window.mark = 1;
//        var rowElements;
//        scope.items = [
//            { name: "Mark", desk: 1 },
//            { name: "Lars", desk: 2 }
//        ];
//        scope.$digest();
//
//        rowElements = element.children();
//
//        expect(rowElements.length).toBe(2);
//    });
//});
