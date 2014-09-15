describe('UI Enhancements: Directive closable', function () {
    var $compile;
    var element, scope, controller;

    beforeEach(module('d2-ui-enhancements'));
    beforeEach(inject(function (_$compile_, $rootScope) {
        $compile = _$compile_;

        element = angular.element('<div closable="details.detailsActive"></div>');
        scope = $rootScope.$new();

        scope.details = {
            detailsActive: true
        }

        $compile(element)(scope);
        scope.$digest();

        controller = element.controller('closable');
    }));

    it('should add closable class to the parent element', function () {
        expect(element).toHaveClass('closable');
    });

    it('should add the class closable to the element', function () {
        expect(element.children().last()).toHaveClass('closable-button');
    });

    it('should add the fa class to the element', function () {
        expect(element.children().last()).toHaveClass('fa');
    });

    it('should call the open function', function () {
        spyOn(controller, 'close');

        element.children().last().click();

        expect(controller.close).toHaveBeenCalledOnce();
    });

    it('should set the passed value to false when clicking', function () {
        element.children().last().click();
        scope.$apply();

        expect(scope.details.detailsActive).toBe(false);
    });
});

describe('UI Enhancements: Directive closable controller', function () {
    var element, scope, controller;

    beforeEach(module('d2-ui-enhancements'));
    beforeEach(inject(function ($compile, $rootScope) {
        element = angular.element('<div closable="closeClick()"></div>');
        scope = $rootScope.$new();

        $compile(element)(scope);

        controller = element.controller('closable');
    }));

    it('should have a close function', function () {
        expect(controller.close).toBeDefined();
    });
});
