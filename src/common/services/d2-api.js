"use strict";
/*
 * Copyright (c) 2004-2014, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the HISP project nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * Created by Mark Polak on 2014-01-24.
 */

!function (angular, d2, undefined) {

    function addTailingSlash(value) {
        if (typeof value !== 'string')
            return value;

        if (value[value.length - 1] === '/')
            return value;

        return value + '/';
    }

    /******************************************************************************/

    d2.api = {};

    /******************************************************************************/

    /**
     * EndPointConfig will be used to set up the endpoints when
     * the ApiProvider builds the api object.
     *
     * @constructor
     */
    d2.api.EndPointConfig = function (name) {
        var self,
            defaultActions = {
                'GET': 'get',
                'PUT': 'update',
                'POST': 'save',
                'PATCH': 'patch',
                'DELETE': 'remove'
            };

        this.name = name;
        this.actions = {};

        // Add the default actions to this endpoint.
        self = this;
        angular.forEach(defaultActions, function(alias, method) {
            self.addHttpAction(method, alias);
        });

        self.addHttpAction('GET', 'one', {});
        self.addHttpAction('GET', 'all', {});
    };
    /**
     * Used to link models to the specific endpoints.
     * If not called a default model will be used
     * @param modelConstructor
     */
    d2.api.EndPointConfig.prototype.model = function (modelConstructor) {
        if (typeof modelConstructor === 'function' )
            this.model = modelConstructor;
    };
    /**
     * Used to set up the route for an endpoint.
     *
     * @param route
     */
    d2.api.EndPointConfig.prototype.route = function (route) {
        if (typeof route === 'string')
            this.route = route;
    };

    d2.api.EndPointConfig.prototype.getRoute = function () {
        if (typeof this.route === 'string') {
            return this.route;
        }
        return this.name;
    };

    /**
     * Adds an action to the endpoint.
     * @param {string} method The HTTP method for the action.
     * @param {string} name The name of the action.
     * @param {Object=} params The default parameters for the action.
     * @param {boolean=} isArray Is the response of type array or not
     */
    d2.api.EndPointConfig.prototype.addHttpAction = function(method, name, params, isArray) {
        this.actions[name] = {
            method: method.toUpperCase(),
            params: params,
            isArray: !!isArray
        };
    };

    /******************************************************************************/

    d2.api.EndPoint = function (endPointConfig, baseRoute, $resource, $http) {
        var self = this,
            addActionToEndPoint = this.addActionToEndPoint.bind(this);

        this.http = $http;
        this.name = endPointConfig.name;
        this.model = endPointConfig.model;
        this.interceptors = {

        };

        if (baseRoute && typeof baseRoute === 'string')
            this.route = baseRoute + endPointConfig.getRoute();

        this.resource = $resource(self.route,
            {}, endPointConfig.actions
        );

        angular.forEach(endPointConfig.actions, function (action, actionName) {
            //Create an interceptor array for each type of actionName
            self.interceptors[actionName] = [];

            //Don't add a custom action for all
            if (actionName === 'all')
                return;

            addActionToEndPoint(actionName);
        });
    };

    d2.api.EndPoint.prototype.addActionToEndPoint = function (actionName) {
        this[actionName] = function (id) {
            var params = {};

            if (angular.isNumber(id) || angular.isString(id)) {
                params.id = id;
            }

            //Return models when using one or all actions
            if (actionName === 'one' || actionName === 'all') {
                return this.requestWithModel(actionName, params);
            }
            return this.request(actionName, params, {});
        };
    };

    d2.api.EndPoint.prototype.all = function (isArray) {
        var promise;
        if (isArray) {
            promise = this.http({
                method:'GET',
                url: this.route
            });

            //Wrap the promise in a promise to extract the right data
            promise = promise.then(function (response) {
                return response.data;
            });
            return this.handleResponse(promise, 'all');
        }
        return this.requestWithModel('all', {});
    };

    /**
     * Perform a standard http request.
     *
     * @param {string} action The name of the action.
     * @param {Object=} params The parameters for the request.
     * @param {Object=} data The request data (for PUT / POST requests).
     * @return {angular.$q.Promise} A promise resolved when the http request has
     *     a response.
     */
    d2.api.EndPoint.prototype.request = function(action, params, data) {
        return this.resource[action](params, data).$promise;
    };

    d2.api.EndPoint.prototype.requestWithModel = function (action, params) {
        var promise = this.request(action, params, {});
        return this.handleResponse(promise, action);
    };

    d2.api.EndPoint.prototype.handleResponse = function (promise, action) {
        var self = this,
            processDataToModel = this.processDataToModel.bind(this),
            unpackWrappedList = this.unpackList.bind(this),
            interceptorData;

        return promise.then(function (response) {
            var dataObject = {},
                data = {},
                meta = {},
                unpackedList = {};

            //console.log(response);
            //Remove the angular promise stuff
            if (angular.isArray(response)) {
                data = response;
            } else {
                data = JSON.parse(angular.toJson(response));
            }

            //Check if we are dealing with a list wrapped with meta data

            if (data[self.name] && data[self.name].length >= 0) {
                unpackedList = unpackWrappedList(data);
                data = unpackedList.data;
                meta =unpackedList.meta;
            }

            //Run all data modifiers
            angular.forEach(self.interceptors[action], function (interceptor) {
                if (angular.isFunction(interceptor)) {
                    interceptorData = interceptor(data);
                }
            });

            //Check if he data modifiers returned undefined data
            if (angular.isObject(interceptorData) || angular.isArray(interceptorData)) {
                data = interceptorData;
            }

            data = processDataToModel(data);

            dataObject.data = data;
            dataObject.meta = meta;

            return dataObject;
        });
    };

    d2.api.EndPoint.prototype.processDataToModel = function (data) {
        var instantiateModel = this.createModelWithData.bind(this);

        if (angular.isString(data[0]))
            return data;

        if (angular.isArray(data)) {
            data = data.map(instantiateModel);
        } else {
            data = instantiateModel(data);
        }
        return data;
    }

    d2.api.EndPoint.prototype.unpackList = function (listObjectWithMetaData) {
        var meta, data;

        data = listObjectWithMetaData[this.name];
        meta = angular.copy(listObjectWithMetaData);
        delete meta[this.name];

        return {
            data: data,
            meta: meta
        };
    };

    d2.api.EndPoint.prototype.createModelWithData = function (data) {
        var model = new this.model();

        //If no model was set we use the default model.
        if (this.model === d2.api.EndPointConfig.prototype.model)
            model = new d2.Model();

        model.afterLoad(data);
        angular.extend(model, data);

        return model;
    };

    d2.api.EndPoint.prototype.responseInterceptor = function (responseType, interceptor) {
        var actionInterceptors = this.interceptors[responseType];
        if (actionInterceptors && angular.isFunction(interceptor))
            actionInterceptors.push(interceptor);
    };

    /******************************************************************************/

    d2.api.Provider = function () {
        this.endPoints = {};
    };

    d2.api.Provider.prototype.setBaseRoute = function (baseRoute) {
        this.baseRoute = addTailingSlash(baseRoute);
        return this;
    };

    d2.api.Provider.prototype.getBaseRoute = function () {
        if (typeof this.baseRoute === 'string' && this.baseRoute !== '') {
            return this.baseRoute;
        }
        return '';
    };

    d2.api.Provider.prototype.addEndPoint = function (name) {
        this.endPoints[name] = new d2.api.EndPointConfig(name);
        return this.endPoints[name];
    };

    d2.api.Provider.prototype.getEndPoint = function (name) {
        if (this.endPoints[name]) {
            return this.endPoints[name];
        }
        throw 'EndPoint can not be found';
    };

    d2.api.Provider.prototype.$get = function ($injector) {
        var self = this,
            api = {};

        angular.forEach(this.endPoints, function (endPointConfig) {
            api[endPointConfig.name] = $injector.instantiate(d2.api.EndPoint, {
                endPointConfig: endPointConfig,
                baseRoute: self.getBaseRoute()
            });
        });

        return api;
    };

    angular.module('d2-api', ['ngResource', 'd2-model']).provider('d2Api', d2.api.Provider);

}(angular, window.d2 = window.d2 || {});
