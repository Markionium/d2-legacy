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
 * Created by Mark Polak on 2014-40-29.
 */
!function(angular, undefined) {
    var d2Rest = angular.module('d2-rest', ['restangular']);

    d2Rest.provider('d2Api', function (RestangularProvider) {

        /*****************************************************************************
         * Provided Object definition
         */

        /**
         * Extend Restangular with a set of predefined endpoints
         * This allows us to still have all the restangular functionality
         * available on our own api. But the predefined endpoints make it
         * more easy for you to use the DHIS2 api.
         *
         * @constructor
         */
        var D2ApiRest = function () {
            this.indicators = this.all('indicators');
            this.currentUser = this.one('me');
            this.currentUser.permissions = this.one('me').all('authorization');
            this.schemas = this.all('schemas');

            /**
             * Add a endpoint to the rest service
             * @param {string} endPointName The name of this endpoint
             * @param {boolean=} isObject If the result is a single object
             */
            this.addEndPoint = function (endPointName, isObject) {
                if (isObject) {
                    this[endPointName] = this.one('endPointName');
                } else {
                    this[endPointName] = this.all('endPointName');
                }
            };
        };

        /*****************************************************************************
         * Provider methods
         */

        /**
         * Set a base url to be used with the api.
         *
         * @param baseUrl=
         */
        this.setBaseUrl = function (baseUrl) {
            this.config.setBaseUrl(baseUrl);
        };

        this.$get = function (Restangular) {
            var api;

            api  = D2ApiRest;
            api.prototype = Restangular;

            return new D2ApiRest();
        };

        /**
         * Expose the restangularProvider so settings can be set that we didn't expose
         * through shorthand methods
         *
         * @type {Object} RestangularProvider instance
         */
        this.config = RestangularProvider;

        /*****************************************************************************
         * Do some extra default configuration specific to our (DHIS2) Api
         */

        /**
         * Response interceptor that takes the data from the endpoint and extracts the meta
         * data that is wrapped around it.
         */
        this.config.addResponseInterceptor(function (data, operation, what, url, response, defered) {
            if (operation === 'getList' && data && data[what]) {
                var newData = data[what],
                    metaData = angular.copy(data);

                delete metaData[what];
                newData.meta = metaData;

                return newData;
            }
            return data;
        });

        /**
         * Add a method to get the original non restangularized data to the
         * This can be used for when only one wants to use the data only.
         */
        this.config.setResponseExtractor(function(response) {
            var newResponse = response,
                dataOnly = angular.copy(response);

            newResponse.getDataOnly = function () {
                return dataOnly;
            };

            return newResponse;
        });

        this.config.setOnElemRestangularized(function (element, isCollection, what, Restangular) {
            if (isCollection || element.getDataOnly) {
                return element;
            }
            element.getDataOnly = function () {
                var result = angular.copy(element);
                result = Restangular.stripRestangular(result);
                delete result.getDataOnly;
                return result;
            };
            return element;
        });
    });

    /**
     * Set the default base url
     */
    d2Rest.config(function (d2ApiProvider) {
        d2ApiProvider.setBaseUrl('/dhis/api');
    });
}(angular);
