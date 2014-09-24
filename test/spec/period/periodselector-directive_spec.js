describe('Period selector directive', function () {
    var element;
    var scope;
    var periodService;

    beforeEach(module('common/period/periodselector.html'));
    beforeEach(module('d2-period', {
        periodService: periodService = periodServiceMock()
    }));
    beforeEach(inject(function ($rootScope, $compile) {
        element = angular.element('<period-selector></period-selector>');

        scope = $rootScope.$new();
        scope.period = {};

        element = $compile(element)(scope);
        scope.$digest();
    }));


    it('should compile to a div', function () {
        expect(element.prop('tagName')).toBe('DIV');
    });

    it('should add a select for the available period types', function () {
        var selectElement = element.children().first();

        expect(selectElement.prop('tagName')).toBe('DIV');
    });

    it('should add a list of options to the select', function () {
        var selectElement = element.find('.ui-select-bootstrap').first();

        expect(selectElement.find('.ui-select-choices-row').length).toBe(11);
    });

    it('should update the list of available options if they change', function () {
        var selectElement;

        spyOn(periodService, 'getPeriodTypes').andReturn(['Yearly']);
        scope.$apply();

        expect(element.children().first().find('.ui-select-choices-row').length).toBe(1);
    });

    it('should display a select box for the periods', function () {
        var selectElementForPeriods;

        selectElementForPeriods = element.find('.ui-select-bootstrap').last();
        scope.$apply();

        expect(selectElementForPeriods.find('.ui-select-choices-row').length).toBe(4);
    });

    it('should disable the period selectbox', function () {
        var selectElementForPeriods;

        selectElementForPeriods = element.find('.ui-select-bootstrap').last();

        expect(selectElementForPeriods.attr('disabled')).toBe('disabled');
    });

    it('should enable the period selectbox when a period type is chosen', function () {
        var selectElementForPeriods;

        scope.period.selectedPeriodType = 'Monthly';
        scope.$apply();

        selectElementForPeriods = element.find('.ui-select-bootstrap').last();

        expect(selectElementForPeriods.attr('disabled')).toBe('disabled');
    });
});