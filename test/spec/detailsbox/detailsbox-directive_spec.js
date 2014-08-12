describe('Details box', function () {
    var element,
        scope;

    beforeEach(module('d2-detailsbox'));
    beforeEach(module('common/detailsbox/detailsbox.html'));

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();

        scope.details = {
            name: "ANC 1st visit",
            "shortName": "ANC 1st",
            "domainType": "AGGREGATE",
            "numberType": "number"
        };
        scope.getDetails = function () {
            return scope.details;
        };

        element = angular.element('<details-box details="getDetails()" />');

        $compile(element)(scope);
        scope.$digest();
    }));

    it('should add the details-menu class to the element', function () {
        expect(element).toHaveClass('details-box');
    });

    it('should display a list of details from the scope', function () {
        expect(element.children().length).toBe(4);
    });

    it('should display the right information for the first element', function () {
        var firstElement = element.children().first().children().first(),
            firstElementHeaderText = firstElement.text(),
            firstElementContentText = firstElement.next().text();

        expect(firstElementHeaderText).toBe('name');
        expect(firstElementContentText).toBe('ANC 1st visit');
    });

    it('should give a details-box-header class to the header elements', function () {
        var headerElements = element.children().children('.details-box-header');

        expect(headerElements.length).toBe(4);
    });

    it('should give a detail-box-content class to the content elements', function () {
        var detailsValuesElements = element.children().children(':not(.details-box-header)');

        expect(detailsValuesElements).toHaveClass('details-box-content');
    });

    it('should use the list of items on the scope', function () {
        var detailsElementsHeaders = element.children().children('.details-box-header'),
            detailsElementsValues = element.children().children(':not(.details-box-header)');

        expect($(detailsElementsHeaders[0]).text()).toBe('name');
        expect($(detailsElementsValues[0]).text()).toBe('ANC 1st visit');

        expect($(detailsElementsHeaders[1]).text()).toBe('shortName');
        expect($(detailsElementsValues[1]).text()).toBe('ANC 1st');
    });

    it('should update the details list when the list is changed', function () {
        var detailsElements;

        scope.details = {
                "name": "ANC 2nd visit",
                "shortName": "ANC 2nd visit",
                "domainType": "AGGREGATE"
            };
        scope.$apply();
        detailsElements = element.children();

        expect(detailsElements.length).toBe(3);
        expect(detailsElements.children('.details-box-header').first().text()).toBe('name');
        expect(detailsElements.children('.details-box-content').first().text()).toBe('ANC 2nd visit');
    });
});
