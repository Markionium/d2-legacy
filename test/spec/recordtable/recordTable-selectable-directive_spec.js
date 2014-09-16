describe('RecordTable: Selectable Directive', function () {
    var element;
    var scope;
    var $compile;

    beforeEach(module('d2-recordtable'));
    beforeEach(inject(function (_$compile_, $rootScope) {
        $compile =_$compile_;
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
            element.data('$recordTableController', {});

            scope.items = [{}, {}, {}];

            element = $compile(element)(scope);
            scope.$digest();

            controller = element.controller('recordTable');
            element = element.children().first();
        }));

        it('should not replace the rowClick function', function () {
            expect(controller.rowClick).not.toBeAFunction();
        });

        it('should set all the items to selected when clicked', function () {
            element.click();

            expect(scope.items[0].selected).toBe(true);
            expect(scope.items[1].selected).toBe(true);
            expect(scope.items[2].selected).toBe(true);
        });
    });

    describe('select one', function () {
        beforeEach(inject(function () {
            element = angular.element('<div><record-table-selectable item="currentItem"></record-table-selectable></div>');
            element.data('$recordTableController', {});

            scope.items = [{ name: 'someItem' }, {}, {}];
            scope.currentItem = scope.items[0];

            element = $compile(element)(scope);
            scope.$digest();

            controller = element.controller('recordTable');
            element = element.children().first();
        }));

        it('should replace the rowClick function', function () {
            expect(controller.rowClick).toBeAFunction();
        });
    });
});
