describe('Paging with remote data', function () {
    var scope,
        $httpBackend,
        controller;

    beforeEach(module('d2-rest'));
    beforeEach(module('d2-recordtable'));

    beforeEach(inject(function (d2Api, _$httpBackend_, $rootScope, $controller, $q, $timeout) {
        $httpBackend = _$httpBackend_;
        scope = $rootScope.$new();

        $httpBackend.expectGET('/dhis/api/dataElements').respond(200, fixtures.api.dataElements.all);

        scope.columns = [
            { name: 'name', sortable: true, sort: 'asc', searchable: true },
            { name: 'code', sortable: true },
            { name: 'lastUpdated' }
        ];

        d2Api.addEndPoint('dataElements');
        scope.tableData = d2Api.dataElements;

        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });

        spyOn(controller, 'processMetaData').andCallThrough();

        controller.parseTableData();
        $timeout.flush();
        $httpBackend.flush();
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should put the meta data on the scope after loading the remote data', function () {
        expect(scope.meta).toBeDefined();
    });

    it('should call process meta data when the meta data is available', function () {
        expect(controller.processMetaData).toHaveBeenCalledOnce();
    });

    it('should parse the pager data', function () {
        expect(controller.pager).toBeDefined();
    });

    it('should set the pages number onto the pager', function () {
        expect(controller.pager.pageCount).toBe(11);
    });

    it('should set the current page onto the pager', function () {
        expect(controller.pager.currentPage).toBe(1);
    });

    it('should set the result total onto the pager', function () {
        expect(controller.pager.resultTotal).toBe(527);
    });

    it('should set the amount of items per page onto the pager', function () {
        expect(controller.pager.itemsPerPage).toBe(50);
    });

    it('should call the switchPage method when currentPage is changed', function () {
        spyOn(controller, 'switchPage');

        controller.pager.currentPage = 2;
        scope.$apply();

        expect(controller.switchPage).toHaveBeenCalledOnce();
    });

    it('should display the new page amount after filtering', function () {
        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:anc')
            .respond(200, fixtures.api.dataElements.filteredOnAnc);

        scope.columns[0].filter = 'anc';
        applyScope(scope);
        $httpBackend.flush();

        expect(scope.items.length).toBe(27);
        expect(controller.pager.resultTotal).toBe(27);
        expect(controller.pager.pageCount).toBe(1);
        expect(controller.pager.currentPage).toBe(1);
    });

    it('should display the new page amount after filtering switching page on a filtered result', function () {
        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an')
            .respond(200, fixtures.api.dataElements.filteredOnAN);

        scope.columns[0].filter = 'an';

        applyScope(scope);
        $httpBackend.flush();

        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an&page=2')
            .respond(200, fixtures.api.dataElements.filteredOnANPage2);

        controller.pager.currentPage = 2;

        $httpBackend.flush();

        expect(controller.pager.resultTotal).toBe(90);
        expect(controller.pager.pageCount).toBe(2);
        expect(controller.pager.currentPage).toBe(2);
    });

    it('should keep the itemsPerPage that was loaded from the first page', function () {
        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an')
            .respond(200, fixtures.api.dataElements.filteredOnAN);

        scope.columns[0].filter = 'an';

        applyScope(scope);
        $httpBackend.flush();

        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an&page=2')
            .respond(200, fixtures.api.dataElements.filteredOnANPage2);

        controller.pager.currentPage = 2;

        $httpBackend.flush();

        expect(controller.pager.itemsPerPage).toBe(50);
    });
});

describe('Paging with local data', function () {
    var scope,
        controller;

    beforeEach(module('d2-recordtable'));

    beforeEach(inject(function ($rootScope, $controller, $q) {
        scope = $rootScope.$new();

        scope.tableConfig = {
            pageItems: 2
        };

        scope.tableData = [
            {
                "name": "ANC 1st visit",
                "code": "DE_359596"
            },
            {
                "name": "ANC 2nd visit",
                "code": "DE_359597"
            },
            {
                "name": "ANC 3rd visit",
                "code": "DE_359598"
            },
            {
                "name": "ANC 4th or more visits",
                "code": "DE_359599"
            },
            {
                "name": "Albendazole given at ANC (2nd trimester)",
                "code": "DE_359602"
            },
            {
                "name": "Expected pregnancies",
                "code": "DE_20899"
            }
        ];

        controller = $controller('RecordTableController', {
            $scope: scope,
            $q: $q
        });

        spyOn(controller, 'processMetaData').andCallThrough();

        controller.parseTableConfig();
        controller.parseTableData();
        scope.$apply();
    }));

    afterEach(function () {
    });

    it('should put only set amount of pageItems into the items array', function () {
        var expectedItems = [{
                "name": "ANC 1st visit",
                "code": "DE_359596"
            }, {
                "name": "ANC 2nd visit",
                "code": "DE_359597"
            }];

        expect(scope.items).toEqual(expectedItems);
    });

    it('should change the items when the page is changed', function () {
        var expectedItems = [{
                "name": "ANC 3rd visit",
                "code": "DE_359598"
            }, {
                "name": "ANC 4th or more visits",
                "code": "DE_359599"
            }];
        controller.pager.currentPage = 2;
        scope.$apply();

        expect(scope.items).toEqual(expectedItems);
    });
});