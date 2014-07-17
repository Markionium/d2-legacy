"use strict";
describe('Breadcrumbs directive', function () {
    var element, scope, crumbsService;

    beforeEach(module('d2-breadcrumbs'));
    beforeEach(module('common/breadcrumbs/breadcrumbs.html'));

    beforeEach(inject(function( $compile, $rootScope, d2BreadCrumbsService ) {
        scope = $rootScope.$new();

        crumbsService = d2BreadCrumbsService;
        crumbsService.crumbsList = [{
                id: 0,
                name: 'Data Element',
                click: function () {}
            },
            {
                id: 1,
                name: 'Data Element Group'
            }
        ];

        element = angular.element('<d2-bread-crumbs />');

        $compile(element)(scope);
        scope.$digest();
    }));

    it('should replace the element with a div that has a class d2-breadcrumbs', function () {
        expect(element.hasClass('d2-breadcrumbs')).toBe(true);
    });

    it('should have a ul element to place the crumbs in', function () {
        expect(element.find('ul').length).toBe(1);
    });

    it('should display a span for each of the crumbs', function () {
        var crumbs = element.find('li');

        expect(crumbs.length).toBe(2);
    });

    it('should give the last crumb a "last" class', function () {
        var lastCrumb = element.find('li').last();

        expect(lastCrumb.hasClass('last')).toBe(true);
    });

    it('should give all the breadcrumbs a crumb class', function () {
        var crumbs = element.find('li');

        expect(crumbs.hasClass('crumb')).toBe(true);
    });

    it('should display the name for the crumbs as html of the span', function () {
        var firstCrumb = element.find('li').first(),
            lastCrumb = element.find('li').last();

        expect(firstCrumb.text()).toBe('Data Element');
        expect(lastCrumb.text()).toBe('Data Element Group');
    });

    it('should add a span.crumb-separator after each crumb except the last', function () {
        var crumbSeparators = element.find('span.crumb-separator');

        expect(crumbSeparators.length).toBe(1);
    });

    it('should add the classes fa and fa-caret-right to the crumb separators', function () {
        var crumbSeparators = element.find('span.crumb-separator');

        expect(crumbSeparators.hasClass('fa')).toBe(true);
        expect(crumbSeparators.hasClass('fa-caret-right')).toBe(true);
    });

    it('should add a separator element to the first item', function () {
        var firstCrumb = element.find('li').first();

        expect(firstCrumb.find('.crumb-separator').length).toBe(1);
    });

    it('should not add a separator element to the last item', function () {
        var lastCrumb = element.find('li').last();

        expect(lastCrumb.find('.crumb-separator').length).toBe(0);
    });

    it('should place all the li elements in the ul', function () {
        var allLiElements = element.find('li').get(),
            liElementsInUl = element.find('ul > li').get();

        expect(allLiElements).toEqual(liElementsInUl);
    });

    it('should call the provided function when a breadcrumb is clicked', function () {
        var firstCrumbElement = element.find('li').first(),
            firstCrumb = crumbsService.crumbsList[0],
            expectedValues;

        spyOn(firstCrumb, 'click');
        expectedValues = angular.copy(firstCrumb); //FIXME: Has to be called after spy else values don't line up
        firstCrumbElement.click();

        expect(firstCrumb.click.callCount).toBe(1);
        expect(firstCrumb.click).toHaveBeenCalledWith(expectedValues);
    });

    it('should not fail when there is no callback', function () {
        var lastCrumbElement = element.find('li').last();

        //This will fail if there is no click property on the crumb object
        lastCrumbElement.click();
    });

    it('should reset to the first crumb when it is clicked', function () {
        var firstCrumbElement = element.find('li').first(),
            firstCrumb = crumbsService.crumbsList[0];

        spyOn(firstCrumb, 'click').andCallThrough();
        firstCrumbElement.click();

        expect(crumbsService.crumbsList.length).toBe(1);
    });

    it('should reset to the third crumb when it is clicked', function () {
        var thirdCrumbElement = element.find('li').last(),
            thirdCrumb =  {
                name: 'test',
                click: function () {}
            },
            crumbCountBeforeClick,
            crumbCountAfterClick;

        spyOn(thirdCrumb, 'click').andCallThrough();
        crumbsService.addCrumb(thirdCrumb.name, thirdCrumb.click);

        crumbCountBeforeClick = crumbsService.crumbsList.length;
        thirdCrumbElement.click();
        crumbCountAfterClick = crumbsService.crumbsList.length;

        expect(crumbCountBeforeClick).toBe(3);
        expect(crumbCountAfterClick).toBe(2);
    });
});
