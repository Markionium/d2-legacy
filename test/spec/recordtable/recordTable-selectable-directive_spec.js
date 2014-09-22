describe('RecordTable: Selectable Directive', function () {
    var element;
    var scope;
    var $compile;
    var createRecordTableControllerMock = function ($scope) {
        var controller = {
            selectAll: function () {
                return function () {
                    _.each($scope.items, function (item) {
                        item.selected = true;
                    });
                };
            }
        };

        spyOn(controller, 'selectAll');

        return controller;
    };

    beforeEach(module('d2-recordtable'));
    beforeEach(inject(function (_$compile_, $rootScope) {
        $compile = _$compile_;
        scope = $rootScope.$new();

        element = angular.element('<div><record-table-selectable></record-table-selectable></div>');
        element.data('$recordTableController', {});

        element = $compile(element)(scope);
        element = element.children().first();
        scope.$digest();
    }));

    it('should compile', function () {
        expect(element.prop('tagName')).toBe('INPUT');
    });

    describe('select all', function () {
        beforeEach(inject(function () {
            element = angular.element('<div><record-table-selectable></record-table-selectable></div>');
            element.data('$recordTableController', createRecordTableControllerMock(scope));

            scope.items = [
                {},
                {},
                {}
            ];

            element = $compile(element)(scope);
            scope.$digest();

            controller = element.controller('recordTable');
            element = element.children().first();
        }));

        it('should not replace the rowClick function', function () {
            expect(controller.rowClick).not.toBeAFunction();
        });
    });

    describe('select one', function () {
        beforeEach(inject(function () {
            element = angular.element('<div><record-table-selectable item="currentItem"></record-table-selectable></div>');
            element.data('$recordTableController', createRecordTableControllerMock(scope));

            scope.items = [
                { name: 'someItem' },
                {},
                {}
            ];
            scope.currentItem = scope.items[0];

            element = $compile(element)(scope);
            scope.$digest();

            controller = element.controller('recordTable');
            element = element.children().first();
        }));

        it('should replace the rowClick function', function () {
            expect(controller.rowClick).toBeAFunction();
        });

        it('should set the checked property when the item is selected', function () {
            scope.currentItem.selected = true;

            scope.$apply();

            expect(element.attr('checked')).toBe('checked');
        });

        it('should not call the selectAll on the controller when selecting one', function () {
            element.click();

            expect(controller.selectAll).not.toHaveBeenCalled();
        });
    });
});
