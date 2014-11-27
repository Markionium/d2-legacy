"use strict";

describe('D2 Rest Interface', function () {

    describe('D2 Rest interface (Indicators type Api)', function () {

        var api, $httpBackend, indicatorList;

        beforeEach(module('d2-rest'));

        //TODO: This should probably mock out the api
        beforeEach(inject(function ($injector, d2Api) {
            $httpBackend = $injector.get('$httpBackend');
            api = d2Api;
            indicatorList = [];
        }));

        it('should transform the all request object to an array', function () {
            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

            api.indicators.getList().then(function (response) {
                indicatorList = response;
            });

            $httpBackend.flush();

            expect(indicatorList.length).toBeDefined();
        });

        it('should get the indicator list from the server', function () {
            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

            api.indicators.getList().then(function (response) {
                indicatorList = response;
            });

            $httpBackend.flush();

            expect(indicatorList.length).toEqual(fixtures.api.indicators.all.indicators.length);
            expect(indicatorList[0].id).toEqual(fixtures.api.indicators.all.indicators[0].id);
        });

        it('should add a method to get dataOnly to all restangularized methods', function () {
            var expectedObject = {
                id: 'Uvn6LCg7dVU',
                created: '2012-11-13T11:51:32.215+0000',
                name: 'ANC 1 Coverage',
                lastUpdated: '2014-04-25T16:22:22.231+0000',
                code: 'IN_52486'
            };

            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

            api.indicators.getList().then(function (response) {
                indicatorList = response;
            });

            $httpBackend.flush();

            expect(indicatorList[0]).toHaveMethod('getDataOnly');
            expect(indicatorList[0].getDataOnly()).toEqual(expectedObject);
        });

        it('should only add the getDataOnly method when there is a response', function () {
            $httpBackend.expectGET('/dhis/api/indicators').respond(200);

            api.indicators.getList();
            $httpBackend.flush();
        });

        it('should add the meta data in a meta data object on the array', function () {
            var actualMeta = {},
                expectedMeta = {
                    pager: fixtures.api.indicators.all.pager
                };

            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

            api.indicators.getList().then(function (response) {
                actualMeta = response.meta;
            });

            $httpBackend.flush();

            expect(actualMeta).toEqual(expectedMeta);
        });

        it('should get the currentUser on currentUser', function () {
            var currentUser = {};

            $httpBackend.expectGET('/dhis/api/me').respond(200, fixtures.api.me.me);

            api.currentUser.get().then(function (response) {
                currentUser = response;
            });

            $httpBackend.flush();

            expect(currentUser.name).toBe('John Traore');
        });

        it('should get the currentUsers authorities', function () {
            var authorities = [],
                expectedAuthorities = fixtures.api.me.authorization;

            $httpBackend.expectGET('/dhis/api/me/authorization').respond(200, expectedAuthorities);

            api.currentUser.permissions.getList().then(function (response) {
                authorities = response;
            });

            $httpBackend.flush();

            expect(authorities.length).toEqual(expectedAuthorities.length);
        });

        it('should add a method to get the original response', function () {
            var restObjectList = [];

            $httpBackend.expectGET('/dhis/api/me/authorization').respond(200, []);

            api.currentUser.permissions.getList().then(function (response) {
                restObjectList = response;
            });

            $httpBackend.flush();

            expect(restObjectList).toHaveMethod('getDataOnly');
        });

        it('should make the original response available on the result', function () {
            var originalAuthorities = [],
                expectedAuthorities = fixtures.api.me.authorization;

            $httpBackend.expectGET('/dhis/api/me/authorization').respond(200, expectedAuthorities);

            api.currentUser.permissions.getList().then(function (response) {
                originalAuthorities = response.getDataOnly();
            });

            $httpBackend.flush();


            expect(originalAuthorities.length).toEqual(expectedAuthorities.length);

            //TODO: No for loops in tests :(  but the arrays don't seem to be equal the values however are. Should do some research into why this is the case
            //expect(originalAuthorities).toEqual(expectedAuthorities);
            angular.forEach(originalAuthorities, function (permission, index) {
                expect(permission).toEqual(expectedAuthorities[index]);
            });
        });

        it('should not add the restangular methods to the original response data', function () {
            var originalAuthorities = [],
                expectedAuthorities = fixtures.api.me.authorization;

            $httpBackend.expectGET('/dhis/api/me/authorization').respond(200, expectedAuthorities);

            api.currentUser.permissions.getList().then(function (response) {
                originalAuthorities = response.getDataOnly();
            });

            $httpBackend.flush();

            expect(originalAuthorities).not.toHaveMethod('doPOST');
        });

        it('should provide a endpoint method that creates an endpoint', function () {
            expect(api.testEndpoint).not.toBeDefined();

            api.addEndPoint('testEndPoint');

            expect(api.testEndPoint).toBeDefined();
            expect(api.testEndPoint).toHaveMethod('get');
            expect(api.testEndPoint).toHaveMethod('getList');
        });

        it('should be possible to add an object endpoint', function () {
            expect(api.testEndpoint).not.toBeDefined();

            api.addEndPoint('testEndPoint', true);

            expect(api.testEndPoint).toBeDefined();
            expect(api.testEndPoint).toHaveMethod('get');
            expect(api.testEndPoint).toHaveMethod('save');
            expect(api.testEndPoint).toHaveMethod('getList');
        });

        it('should throw an error when trying to add a endPoint with a leading slash', function () {
            function addEndPointwithSlash() {
                api.addEndPoint('/testEndPoint');
            }

            expect(addEndPointwithSlash).toThrow('D2Api Error: EndPoint should not have a leading slash');
        });

        it('should return the endpoint after adding it', function () {
            var endPoint = api.addEndPoint('testEndPoint');

            expect(endPoint).toBe(api.testEndPoint);
        });

        it('should return an error when trying to add an endPoint that already exists', function () {
            function addEndPointTwice() {
                api.addEndPoint('testEndPoint');
                api.addEndPoint('testEndPoint');
            }

            expect(addEndPointTwice).toThrow('D2Api Error: EndPoint "testEndPoint" already exists');
        });

        it('should return an endpoint when calling the getEndPoint method', function () {
            var endPoint;

            api.addEndPoint('testEndPoint');
            endPoint = api.getEndPoint('testEndPoint');

            expect(endPoint).toBe(api['testEndPoint']);
        });

        it('should throw an error when the endpoint does not exist', function () {
            function gettingUnknownEndPoint() {
                api.getEndPoint('testEndPoint');
            }

            expect(gettingUnknownEndPoint).toThrow('D2Api Error: Endpoint does not exist');
        });

        it('should return true when calling hasEndPoint with a valid endpoint name', function () {
            api.addEndPoint('testEndPoint');

            expect(api.hasEndPoint('testEndPoint')).toBe(true);
        });

        it('should return false when calling hasEndPoint with a non existing endpoint', function () {
            expect(api.hasEndPoint('testEndPoint')).toBe(false);
        });
    });

    /**
     * The inject(function() {}) method used on the it() calls makes sure that the injector
     * is set up before executing the test and therefore provider to be defined.
     */
    describe('Api config', function () {
        var provider;

        beforeEach(module('d2-rest', function (d2ApiProvider) {
            provider = d2ApiProvider;
        }));

        it('should provide a shorthand method for the setBaseUrl', inject(function () {
            expect(provider).toBeDefined();
        }));

        it('should make the restangular base url setting available through config', inject(function () {
            expect(provider.config.setBaseUrl).toBeDefined();
            expect(provider.config).toHaveMethod('setBaseUrl');
        }));

        it('should provide a shorthand method for the setBaseUrl', inject(function () {
            spyOn(provider.config, 'setBaseUrl');

            provider.setBaseUrl('/dhis/api');

            expect(provider.config.setBaseUrl).toHaveBeenCalledWith('/dhis/api');
        }));

        it('should override the default base url if the setBaseUrl is called again', inject(function(d2Api, $httpBackend) {
            $httpBackend.expectGET('/mark/api/test').respond(200, []);

            provider.setBaseUrl('/mark/api');
            d2Api.all('test').getList();

            $httpBackend.flush();
        }));
    });

    describe('expired session handler', function () {
        var d2Api, $httpBackend, $http,
            reloaded = false;

        beforeEach(module('d2-rest'));
        beforeEach(inject(function (_$httpBackend_, _$http_, _d2Api_, $window) {
            $httpBackend = _$httpBackend_;
            d2Api = _d2Api_;
            $http = _$http_;

//            $window.location.reload = function () {
//                reloaded = true;
//            };
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should not intercept the response when the response is json', function () {
            var actualResult;
            $httpBackend.expectGET('/dhis/api/dataIndicators').respond(200, [{}, {}]);
            $http.get('/dhis/api/dataIndicators').success(function (responseData) {
                actualResult = responseData;
            });
            $httpBackend.flush();

            expect(actualResult).toEqual([{}, {}]);
        });

//        it('should intercept the response when the response is the login page', function () {
//            $httpBackend.expectGET('/dhis/api/dataIndicators').respond(200, fixtures.api.loginpage);
//
//            $http.get('/dhis/api/dataIndicators');
//
//            $httpBackend.flush();
//
//            expect(reloaded).toBe(true);
//        });
    });
});
