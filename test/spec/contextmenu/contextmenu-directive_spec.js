describe('Context menu', function () {
    var element,
        scope;

    beforeEach(module('d2-contextmenu'));
    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();

        element = angular.element('<div contextmenu></div>');
    }));

    it('add the context-menu class to the element', function () {

    });
});