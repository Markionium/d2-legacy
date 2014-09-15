describe('Directive: recordtable', function () {
    var element, scope;

    beforeEach(module('ui.bootstrap.tpls'));
    beforeEach(module('ui.bootstrap.pagination'));
    beforeEach(module('d2-recordtable'));
    beforeEach(module('d2-rest'));
    beforeEach(module('d2-filters'));
    beforeEach(module('common/recordtable/recordtable.html'));

    beforeEach(inject(function (_$compile_, $rootScope) {
        var tableConfig = {},
            tableData = [
                { name: "Mark", desk: 1 },
                { name: "Lars", desk: 2 },
                { name: "Morten", desk: 3 }
            ];

        $compile = _$compile_;

        scope = $rootScope.$new();

        scope.tableConfig = tableConfig;
        scope.tableData = tableData;

        element = angular.element('<record-table table-config="tableConfig" table-data="tableData" table-context-menu="contextMenu" />');
    }));

    describe('without context menu', function () {
        beforeEach(function () {
            $compile(element)(scope);
            scope.$digest();
        });

        it('should not add the context menu to recordtable', function () {
            expect(element.children().length).toBe(2);
        });
    });

    describe('with context menu', function () {
        var callbackSpy = jasmine.createSpy();

        beforeEach(function () {
            scope.contextMenu = [
                { name: 'details', click: callbackSpy },
                { name: 'translate', click: function () {} },
                { name: 'other', click: function () {} }
            ];

            $compile(element)(scope);
            scope.$digest();
        });

        it('should add the context menu to recordtable', function () {
            expect(element.children().length).toBe(3);
            expect(element.children().last()).toHaveClass('record-table-context-menu');
        });

        it('should display a row for each of the contextmenu functions', function () {
            var contextMenuElement = element.children().last().find('ul');

            expect(contextMenuElement.children().length).toBe(3);
        });

        it('should call a click handler when clicking on a menu item', function () {
            var clickableMenuItemElement = element.children().last().find('ul').children().first();
            clickableMenuItemElement.click();

            expect(callbackSpy).toHaveBeenCalledOnce();
        });

        it('should call the click handler with the current record', function () {
            var clickableMenuItemElement = element.children().last().find('ul').children().first();
            clickableMenuItemElement.click();

            //expect(callbackSpy).toHaveBeenCalledWith(scope.tableData.);
        });

        it('should give the id recordTableContextMenu to the context menu ul', function () {
            var contextMenuElement = element.children().last().find('ul');

            expect(contextMenuElement.attr('id')).toBe('recordTableContextMenu');
        });
    });


});