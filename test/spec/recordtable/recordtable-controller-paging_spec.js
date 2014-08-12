describe('Meta data', function () {
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
        expect(scope.pager).toBeDefined();
    });

    it('should set the pages number onto the pager', function () {
        expect(scope.pager.pageCount).toBe(11);
    });

    it('should set the current page onto the pager', function () {
        expect(scope.pager.currentPage).toBe(1);
    });

    it('should set the result total onto the pager', function () {
        expect(scope.pager.resultTotal).toBe(527);
    });

    it('should set the amount of items per page onto the pager', function () {
        expect(scope.pager.itemsPerPage).toBe(50);
    });

    it('should call the switchPage method when currentPage is changed', function () {
        spyOn(controller, 'switchPage');

        scope.pager.currentPage = 2;
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
        expect(scope.pager.resultTotal).toBe(27);
        expect(scope.pager.pageCount).toBe(1);
        expect(scope.pager.currentPage).toBe(1);
    });

    it('should display the new page amount after filtering switching page on a filtered result', function () {
        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an')
            .respond(200, fixtures.api.dataElements.filteredOnAN);

        scope.columns[0].filter = 'an';

        applyScope(scope);
        $httpBackend.flush();

        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an&page=2')
            .respond(200, fixtures.api.dataElements.filteredOnANPage2);

        scope.pager.currentPage = 2;

        $httpBackend.flush();

        expect(scope.pager.resultTotal).toBe(90);
        expect(scope.pager.pageCount).toBe(2);
        expect(scope.pager.currentPage).toBe(2);
    });

    it('should keep the itemsPerPage that was loaded from the first page', function () {
        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an')
            .respond(200, fixtures.api.dataElements.filteredOnAN);

        scope.columns[0].filter = 'an';

        applyScope(scope);
        $httpBackend.flush();

        $httpBackend.expectGET('/dhis/api/dataElements?filter=name:like:an&page=2')
            .respond(200, fixtures.api.dataElements.filteredOnANPage2);

        scope.pager.currentPage = 2;

        $httpBackend.flush();

        expect(scope.pager.itemsPerPage).toBe(50);
    });
});
