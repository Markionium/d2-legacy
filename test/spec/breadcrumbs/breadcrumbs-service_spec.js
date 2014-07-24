"use strict";
describe('BreadCrumbsService', function () {
    var breadCrumbsService;


    beforeEach(module('d2-breadcrumbs'));
    beforeEach(inject(function (_breadCrumbsService_) {
        breadCrumbsService = _breadCrumbsService_;
    }));


    it('should have an empty list as a crumbsList', function () {
        expect(breadCrumbsService.crumbsList).toEqual([]);
    });

    it('should add a crumb to the list when calling addCrumb', function () {
        breadCrumbsService.addCrumb('maintenance');

        expect(breadCrumbsService.crumbsList.length).toBe(1);
        expect(breadCrumbsService.crumbsList[0].name).toBe('maintenance');
    });

    it('should add a click parameter for the maintenance crumb', function () {
        breadCrumbsService.addCrumb('maintenance', function() {return 'this';});

        expect(breadCrumbsService.crumbsList[0].name).toBe('maintenance');
        expect(breadCrumbsService.crumbsList[0].click()).toBe('this');
    });

    it('should add an id for the second crumb', function () {
        var secondCrumbId;

        breadCrumbsService.addCrumb('root');
        breadCrumbsService.addCrumb('dataelement');

        secondCrumbId = breadCrumbsService.crumbsList[1].id;

        expect(secondCrumbId).toEqual(1);
    });

    it('reset crumbs should reset the crumbs list to the initial start', function () {
        breadCrumbsService.addCrumb('root');
        breadCrumbsService.addCrumb('dataelement');
        breadCrumbsService.addCrumb('mark');

        breadCrumbsService.resetCrumbs();

        expect(breadCrumbsService.crumbsList.length).toBe(1);
        expect(breadCrumbsService.crumbsList[0].name).toBe('root');
    });

    it('reset crumbs should reset the crumbs list to the past id being the last item', function () {
        breadCrumbsService.addCrumb('root');
        breadCrumbsService.addCrumb('dataelement');
        breadCrumbsService.addCrumb('mark');

        breadCrumbsService.resetCrumbs(1);

        expect(breadCrumbsService.crumbsList.length).toBe(2);
        expect(breadCrumbsService.crumbsList[0].name).toBe('root');
        expect(breadCrumbsService.crumbsList[1].name).toBe('dataelement');
    });
});