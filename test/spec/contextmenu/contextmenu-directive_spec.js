describe('Context menu', function () {
    var element, elementController;
    var scope;
    var $compile;

    var templatesForDropdowns = [
        '<div id="firstDropDown" class="context-menu-dropdown dropdown">',
        '<ul class="dropdown-menu">',
            '<li>Translate</li>',
            '<li>Stuff</li>',
            '<li>Details</li>',
        '</ul>',
        '</div>',
        '<div id="secondDropDown" class="context-menu-dropdown dropdown">',
        '<ul class="dropdown-menu">',
            '<li>Translate</li>',
        '</ul>',
        '</div>'
    ].join('');

    beforeEach(module('d2-contextmenu'));
    beforeEach(inject(function (_$compile_, $rootScope) {
        $('body').append(templatesForDropdowns);

        $compile = _$compile_;
        scope = $rootScope.$new();

        element = angular.element('<div context-menu="firstDropDown"></div>');

        $compile(element)(scope);
        scope.$digest();

        elementController = element.controller('contextMenu');
    }));

    describe('multiple context menus', function () {
        var secondElement, secondElementController;

        beforeEach(function () {
            secondElement = angular.element('<div context-menu="secondDropDown"></div>');

            $compile(secondElement)(scope);
            scope.$digest();

            secondElementController = secondElement.controller('contextMenu');
        });

        it('should not conflict in items', function () {
            expect(elementController.contextMenuId).toBe('firstDropDown');
            expect(secondElementController.contextMenuId).toBe('secondDropDown');
        });
    });

    it('should add the context-menu class to the element', function () {
        expect(element).toHaveClass('context-menu');
    });

//    it('should add the open class to the dropdown menu when being clicked', function () {
//        element.click();
//
//        expect($('#firstDropDown')).toHaveClass('open');
//    });

//    it('should close other drop downs when one is clicked', function () {
//        var secondDropdown = $('#secondDropDown');
//        secondDropdown.addClass('open');
//        expect(secondDropdown).toHaveClass('open');
//
//        element.click();
//        expect(secondDropdown).not.toHaveClass('open');
//    });
});