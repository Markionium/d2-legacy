"use strict";

describe('DHIS2 Api Module', function () {

    /******************************************************************************/

    beforeEach(module('ngResource'));
    beforeEach(function () {
        this.addMatchers(jasmine_custom_matchers);
    });

    /******************************************************************************/

    describe('EndPoint Configuration', function () {
        var endPointConfig;

        beforeEach(function () {
            endPointConfig = new d2.api.EndPointConfig('testEndPoint');
        });

        it('should create an endpoint with a name', function () {
            expect(endPointConfig.name).toBe('testEndPoint');
        });

        it('should have an actions property', function () {
            expect(endPointConfig.actions).toBeDefined();
        });

        it('should have a get action that corresponds to GET', function () {
            expect(endPointConfig.actions.get).toEqual({ method: 'GET', params: undefined, isArray: false });
        });

        it('should have a save action that corresponds to POST', function () {
            expect(endPointConfig.actions.save).toEqual({ method: 'POST', params: undefined, isArray: false });
        });

        it('should have an patch action that corresponds to PATCH', function () {
            expect(endPointConfig.actions.patch).toEqual({ method: 'PATCH', params: undefined, isArray: false });
        });

        it('should have an update action that corresponds to PUT', function () {
            expect(endPointConfig.actions.update).toEqual({ method: 'PUT', params: undefined, isArray: false });
        });

        it('should have a remove action that corresponds to DELETE', function () {
            expect(endPointConfig.actions.remove).toEqual({ method: 'DELETE', params: undefined, isArray: false });
        });

        it('should allow a model constructor to be set for the endpoint', function () {
            var Model = function () {};

            endPointConfig.model(Model);

            expect(endPointConfig.model).toBe(Model);
        });

        it('should not replace the model if it is not a function', function () {
            var oldModel = endPointConfig.model;

            endPointConfig.model({});

            expect(endPointConfig.model).toBe(oldModel);
        });

        it('should allow a route to be set for the endpoint', function () {
            endPointConfig.route('indicators');

            expect(endPointConfig.route).toBe('indicators');
        });

        it('should not replace the route if it is not a string', function () {
            var oldRoute = endPointConfig.route;

            endPointConfig.route({});

            expect(endPointConfig.route).toBe(oldRoute);
        });

        it ('should have a method to get the route', function () {
            expect(endPointConfig).toHaveMethod('getRoute');
        });

        it('should return the correct route when getRoute is called', function () {
            endPointConfig.route('indicator');

            expect(endPointConfig.getRoute()).toBe('indicator');
        });

        it('should return the name of the endpoint api as a route if no route is set', function () {
           expect(endPointConfig.getRoute()).toBe('testEndPoint');
        });
    });

    /******************************************************************************/

    describe('EndPoint structure', function () {
        var endPointConfig, endPoint;

        beforeEach(inject(function ($injector) {
            endPointConfig = new d2.api.EndPointConfig('indicators');

            endPoint = $injector.instantiate(d2.api.EndPoint, {
                endPointConfig: endPointConfig,
                baseRoute: '/dhis/api/'
            });
        }));

        it('should create an endpoint based on a endpoint config', function () {
            expect(endPoint).toBeInstanceOf(d2.api.EndPoint);
        });

        it('should have the default methods', function () {
            expect(endPoint).toHaveMethod('get');
            expect(endPoint).toHaveMethod('update');
            expect(endPoint).toHaveMethod('save');
            expect(endPoint).toHaveMethod('patch');
            expect(endPoint).toHaveMethod('remove');
        });

        it('should have a request method', function () {
            expect(endPoint).toHaveMethod('request');
        });

        it('should have a route in the form of a url', function () {
           expect(endPoint.route).toBe('/dhis/api/indicators');
        });

        it('should have a model property that is a method (constructor)', function () {
            expect(endPoint.model).toBeDefined();
            expect(endPoint.model).toBeInstanceOf(Function);
        });

        it('should create a model with data', function () {
            var model = endPoint.createModelWithData({});

            expect(model).toBeDefined();
            expect(model).toHaveMethod('beforeSave');
            expect(model).toHaveMethod('afterLoad');
        });

        it('should pass the right data to the model', function () {
            var model = endPoint.createModelWithData({
                "element1": "someElement",
                "another2": "oneMoreElement"
            });

            expect(model.element1).toBe("someElement");
            expect(model.another2).toBe("oneMoreElement");
        });

        ////////////////////////////////////////////////////////////////////////////
        describe('Model pass through', function () {
            var endPointConfig, endPoint, IndicatorModel, endPointModel;

            beforeEach(inject(function ($injector) {
                //Create a new model constructor
                IndicatorModel = function () {};
                //Wire up the model as a prototype
                IndicatorModel.prototype = new d2.Model();

                //Set up a new endpoint config with a model
                endPointConfig = new d2.api.EndPointConfig('indicators');
                endPointConfig.model = IndicatorModel;

                //Create the endpoint with the new model
                endPoint = $injector.instantiate(d2.api.EndPoint, {
                    endPointConfig: endPointConfig,
                    baseRoute: '/dhis/api/'
                });

                endPointModel = new endPoint.model();
            }));

            it('should pass the right model constructor to the endpoint', function () {
                expect(endPointModel).toHavePrototype(d2.Model);
            });

            it('should still have the data mutation methods', function () {
                expect(endPointModel).toHaveMethod('afterLoad');
                expect(endPointModel).toHaveMethod('beforeSave');
            });
        });
        ////////////////////////////////////////////////////////////////////////////

        it('should be able to unpack a wrapped list', function () {
            var packedList = fixtures.api.indicators.all,
            unpackedList = endPoint.unpackList(packedList),
            meta = { pager : { page : 1, pageCount : 2, total : 53, nextPage : 'https://apps.dhis2.org/dev/api//indicators?page=2' } };

            expect(unpackedList.meta).toEqual(meta);
            expect(unpackedList.data).toEqual(fixtures.api.indicators.all.indicators);
        });

        it('should unpack data only and return a empty meta object', function () {
            var packedList = fixtures.api.schemas.all,
                unpackedList,
                meta = {};

            endPoint.name = 'schemas';

            unpackedList = endPoint.unpackList(packedList);

            expect(unpackedList.meta).toEqual(meta);
            expect(unpackedList.data).toEqual(packedList.schemas);
        });

        it('should have an instance of the http service', function () {
            expect(endPoint.http).toBeDefined();
            expect(endPoint.http.get).toBeDefined();
        });
    });

    /******************************************************************************/

    describe('EndPoint communication', function () {
        var endPointConfig, endPoint, $httpBackend;

        beforeEach(inject(function ($injector) {
            $httpBackend = $injector.get('$httpBackend');

            endPointConfig = new d2.api.EndPointConfig('indicators');

            endPoint = $injector.instantiate(d2.api.EndPoint, {
                endPointConfig: endPointConfig,
                baseRoute: '/dhis/api/'
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should do a GET request on a request with get', function () {
            $httpBackend.expectGET('/dhis/api/indicators').respond(200, '');

            endPoint.request('get', {}, {});

            $httpBackend.flush();
        });

        it('should do a POST request on a request with save', function () {
            $httpBackend.expectPOST('/dhis/api/indicators').respond(200, '');

            endPoint.request('save', {}, {});

            $httpBackend.flush();
        });

        it('should do a PUT request on request with update', function () {
            $httpBackend.expectPUT('/dhis/api/indicators').respond(200, '');

            endPoint.request('update', {}, {});

            $httpBackend.flush();
        });

        it('should do a PATCH request on a request with patch', function () {
            $httpBackend.expectPATCH('/dhis/api/indicators').respond(200, '');

            endPoint.request('patch', {}, {});

            $httpBackend.flush();
        });

        it('should do a DELETE request on a request with remove', function () {
            $httpBackend.expectDELETE('/dhis/api/indicators').respond(200, '');

            endPoint.request('remove', {}, {});

            $httpBackend.flush();
        });

        it('should do a GET on shorthand method get', function () {
            spyOn(endPoint, 'request');

            endPoint.get();

            expect(endPoint.request).toHaveBeenCalledWith('get', {}, {});
        });

        it('should do a POST request on shorthand method save', function () {
            spyOn(endPoint, 'request');

            endPoint.save();

            expect(endPoint.request).toHaveBeenCalledWith('save', {}, {});
        });

        it('should have a method to request with a model', function () {
            expect(endPoint).toHaveMethod('requestWithModel');
        });

        it('should add parameters to the request when passed', function () {
            $httpBackend.expectGET('/dhis/api/indicators?filter=%5Bthings,more%5D').respond(200, '');

            endPoint.request('get', {"filter": "[things,more]"});

            $httpBackend.flush();
        });

        it('should add a body to the request when data is passed', function () {
            $httpBackend.expectPOST('/dhis/api/indicators', { "filter": ["things", "more"] }).respond(200, '');

            endPoint.request('save', {}, { "filter": ["things", "more"]});

            $httpBackend.flush();

        });

        it('should do a GET request when requestWithModel is called with get', function () {
            $httpBackend.expectGET('/dhis/api/indicators').respond(200, '');

            endPoint.requestWithModel('get');

            $httpBackend.flush();
        });

        it('should return a model when calling requestWithModel', function () {
            var requestResult, model = undefined;

            $httpBackend.expectGET('/dhis/api/indicators').respond({
                some: "data"
            });

            requestResult = endPoint.requestWithModel('get');
            requestResult.then(function (response) {
                model = response.data;
            });

            $httpBackend.flush();

            expect(model).toBeInstanceOf(d2.Model);
        });

        it('should create an array of models when the response a packed array', function () {
            var requestResult, models;

            $httpBackend.expectGET('/dhis/api/indicators').respond(200, fixtures.api.indicators.all);

            requestResult = endPoint.requestWithModel('all');
            requestResult.then(function (response) {
                models = response.data;
            });

            $httpBackend.flush();

            expect(models.length).toBe(50);
            expect(models[0]).toHavePrototype(d2.Model);
        });

        describe('Multiple endpoints', function () {
            var $httpBackend,
                endPointIndicators,
                endPointSchemas;

            beforeEach(inject(function ($injector) {
                $httpBackend = $injector.get('$httpBackend');

                endPointConfig = new d2.api.EndPointConfig();
                endPointConfig.name = 'indicators';

                endPointIndicators = $injector.instantiate(d2.api.EndPoint, {
                    endPointConfig: endPointConfig,
                    baseRoute: '/dhis/api/'
                });

                endPointConfig.name = 'schemas';

                endPointSchemas = $injector.instantiate(d2.api.EndPoint, {
                    endPointConfig: endPointConfig,
                    baseRoute: '/dhis/api/'
                });

            }));

            it('should do separate calls', function () {
                var succCallBack = jasmine.createSpy(),
                    errCallBack = jasmine.createSpy();

                $httpBackend.expectGET('/dhis/api/indicators').respond(200);
                $httpBackend.expectGET('/dhis/api/schemas').respond(500);

                endPointIndicators.all().then(succCallBack, errCallBack);
                endPointSchemas.all().then(succCallBack, errCallBack);

                $httpBackend.flush();

                expect(errCallBack).toHaveBeenCalled();
                expect(errCallBack.callCount).toEqual(1);

                expect(succCallBack).toHaveBeenCalled();
                expect(errCallBack.callCount).toEqual(1);
            });
        });

    });

    /******************************************************************************/

    describe('Provider', function () {
        var provider;

        beforeEach(module('d2-api', function (d2ApiProvider) {
            provider = d2ApiProvider;
        }));

        it('should have a api provider', inject(function () {
            expect(provider).toBeDefined();
        }));

        it('should have a base route setter and getter', function () {
            expect(provider).toHaveMethod('setBaseRoute');
            expect(provider).toHaveMethod('getBaseRoute');
        });

        it('should set the correct base route', function () {
            provider.setBaseRoute('/dhis/api/');

            expect(provider.baseRoute).toBe('/dhis/api/');
        });

        it('should get the correct base route', function () {
            provider.baseRoute = '/dhis/api/';

            expect(provider.getBaseRoute()).toBe('/dhis/api/');
        });

        it('should add a trailing slash to the baseRoute', function () {
            provider.setBaseRoute('/dhis/api');

            expect(provider.baseRoute).toBe('/dhis/api/');
        });

        it('should an empty string is the base route is not valid', function () {
            provider.baseRoute = undefined;

            expect(provider.getBaseRoute()).toBe('');
        });

        it('should have setBaseRoute return itself', function () {
            var result = provider.setBaseRoute();

            expect(result).toEqual(provider);
        });

        it('should have a method to add an api endpoint', inject(function () {
            expect(provider).toHaveMethod('addEndPoint');
        }));

        it('should add an endpoint to the provider', inject(function () {
            var end_point;

            provider.addEndPoint('schemas');
            end_point = provider.getEndPoint('schemas');

            expect(end_point.name).toBe('schemas');
        }));

        it('should have addEndPoint return itself', function () {
            var result = provider.addEndPoint('schemas');

            expect(result.name).toEqual('schemas');
            expect(result).toHaveMethod('route');
        });

        it('should throw an error when a endpoint can not be found', inject(function () {
            var getUnknownEndpoint = function () {
                provider.getEndPoint('unknown');
            };

            expect(getUnknownEndpoint).toThrow();
        }));

        it('should create an api object when the $get function is called', inject(function () {
            var api = provider.$get();

            expect(api).toBeDefined();
        }));
    });

    /******************************************************************************/

    describe('Api', function () {
        var endPointConfig, endPoint, provider;

        beforeEach(module('d2-api', function (d2ApiProvider) {
            provider = d2ApiProvider;
            endPoint = provider.addEndPoint('indicators');
            provider.setBaseRoute('/dhis/api');
        }));

        beforeEach(inject(function ($injector) {
            endPointConfig = new d2.api.EndPointConfig('indicators');
            endPoint = $injector.instantiate(d2.api.EndPoint, {
                endPointConfig: endPointConfig,
                baseRoute: provider.baseRoute
            });
        }));

        it('should have the endpoint defined in the provider', inject(function (d2Api) {
            expect(d2Api.indicators.name).toEqual(endPoint.name);
            expect(d2Api.indicators.route).toEqual(endPoint.route);
        }));
    });

    /******************************************************************************/

    describe('Data manipulation', function () {
        var endPointConfig, endPoint, IndicatorModel, endPointModel,
            emptyInterceptorObject;

        beforeEach(inject(function ($injector) {
            //Create a new model constructor
            IndicatorModel = function () {};
            //Wire up the model as a prototype
            IndicatorModel.prototype = new d2.Model();

            IndicatorModel.prototype.afterLoad = function (data) {
                angular.extend(data, {"afterLoadCalled": "done"});
            };

            //Set up a new endpoint config with a model
            endPointConfig = new d2.api.EndPointConfig('indicators');
            endPointConfig.model = IndicatorModel;
            endPointConfig.route = 'indicators/:id';

            //Create the endpoint with the new model
            endPoint = $injector.instantiate(d2.api.EndPoint, {
                endPointConfig: endPointConfig,
                baseRoute: '/dhis/api/'
            });

            endPointModel = new endPoint.model();

            emptyInterceptorObject = {
                get: {},
                save: {},
                update: {},
                patch: {},
                all: {},
                one: {},
                remove: {}
            };
        }));

        it('should call the afterLoad method on the model after it loaded', function () {
            var model = endPoint.createModelWithData({});

            expect(model.afterLoadCalled).toBeDefined();
            expect(model.afterLoadCalled).toBe("done");
        });

        it('should have a intercept method', function () {
            expect(endPoint).toHaveMethod('responseInterceptor');
        });

        it('should add a interceptor to the list of interceptors', function () {
            var interceptor = function() {};
            endPoint.responseInterceptor('get', interceptor);

            expect(endPoint.interceptors.get[0]).toBe(interceptor);
        });

        it('should not add the interceptor when the action does not exist', function () {
            var interceptor = function () {};

            endPoint.responseInterceptor('unknown', interceptor);

            expect(endPoint.interceptors).toEqual(emptyInterceptorObject);
        });

        it('should not add the interceptor when the interceptor is not a function', function () {
            var interceptor = {};

            endPoint.responseInterceptor('get', interceptor);

            expect(endPoint.interceptors).toEqual(emptyInterceptorObject);
        });

        it('should call a response interceptor when a response is received', inject(function ($httpBackend) {
            var spyFunction = jasmine.createSpy("Interceptor");

            $httpBackend.expectGET('/dhis/api/indicators').respond({});

            endPoint.responseInterceptor('get', spyFunction);
            endPoint.requestWithModel('get');

            $httpBackend.flush();

            expect(spyFunction).toHaveBeenCalled();
        }));

        it('should request a single one on get with id', inject(function ($httpBackend) {
            $httpBackend.expectGET('/dhis/api/indicators/Uvn6LCg7dVU').respond(fixtures.api.indicators.one);

            endPoint.get('Uvn6LCg7dVU');

            $httpBackend.flush();
        }));

        it('should request a single one on one()', inject(function ($httpBackend) {
            $httpBackend.expectGET('/dhis/api/indicators/Uvn6LCg7dVU').respond(fixtures.api.indicators.one);

            endPoint.one('Uvn6LCg7dVU');

            $httpBackend.flush();
        }));

        it('should use requestWithModel when calling one()', inject(function ($httpBackend) {
            spyOn(endPoint, 'requestWithModel').andCallThrough();
            $httpBackend.expectGET('/dhis/api/indicators/Uvn6LCg7dVU').respond(fixtures.api.indicators.one);

            endPoint.one('Uvn6LCg7dVU');

            $httpBackend.flush();

            expect(endPoint.requestWithModel.callCount).toBe(1);
        }));

        it('should use requestWithModel when calling all()', inject(function ($httpBackend) {
            spyOn(endPoint, 'requestWithModel').andCallThrough();
            $httpBackend.expectGET('/dhis/api/indicators').respond(fixtures.api.indicators.one);

            endPoint.all();

            $httpBackend.flush();

            expect(endPoint.requestWithModel.callCount).toBe(1);
        }));

        it('should add properties to the data for a single object', inject(function ($httpBackend) {
            var model;
            $httpBackend.expectGET('/dhis/api/indicators').respond(fixtures.api.indicators.one);

            endPoint.requestWithModel('get').then(function (response) {
               model = response.data;
            });

            $httpBackend.flush();

            expect(model.id).toBe('Uvn6LCg7dVU');
            expect(model.name).toBe('ANC 1 Coverage');
        }));

        it('should add a list of object to the data property for multiple objects', inject(function ($httpBackend) {
            var model, firstIndicator;
            $httpBackend.expectGET('/dhis/api/indicators').respond(fixtures.api.indicators.all);

            endPoint.requestWithModel('get').then(function (response) {
                model = response.data;
            });

            $httpBackend.flush();

            firstIndicator = model[0];

            expect(firstIndicator.id).toBe('Uvn6LCg7dVU');
            expect(firstIndicator.name).toBe('ANC 1 Coverage');
        }));

        it('should remove the object list from the object after calling requestWithModel', inject(function ($httpBackend) {
            var modelResponse;
            $httpBackend.expectGET('/dhis/api/indicators').respond(fixtures.api.indicators.all);

            endPoint.requestWithModel('all').then(function (response) {
                modelResponse = response;
            });

            $httpBackend.flush();

            expect(modelResponse.indicators).not.toBeDefined();
        }));

        it('should take the meta data from around a list and add that to the response', inject(function ($httpBackend) {
            var meta;
            $httpBackend.expectGET('/dhis/api/indicators').respond(fixtures.api.indicators.all);

            endPoint.requestWithModel('get').then(function (response) {
               meta = response.meta;
            });

            $httpBackend.flush();

            expect(meta.pager.page).toBe(1);
            expect(meta.pager.pageCount).toBe(2);
            expect(meta.pager.total).toBe(53);
        }));
    });

    /******************************************************************************/
});
