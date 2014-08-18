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
         *
         */
        this.addEndPoint = function (endPointName, isObject) {

            //Remove the first character if it's a /
            if (endPointName.match(/^\//)) {
                throw 'D2Api Error: EndPoint should not have a leading slash';
            }

            if (this[endPointName]) {
                throw 'D2Api Error: EndPoint "' + endPointName + '" already exists';
            }

            if (isObject) {
                this[endPointName] = this.one(endPointName);
            } else {
                this[endPointName] = this.all(endPointName);
            }

            return this[endPointName];
        };

        this.getEndPoint = function (endPointName) {
            if (this[endPointName] === undefined) {
                throw 'D2Api Error: Endpoint does not exist';
            }
            return this[endPointName];
        };

        this.hasEndPoint = function (endPointName) {
            if (this[endPointName]) {
                return true;
            }
            return false;
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

        api = D2ApiRest;
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
    this.config.setResponseExtractor(function (response) {
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

        //TODO: In chrome canary we cannot extend strings (30-Jul-2014)?
        if (angular.isString(element)) {
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
 * @ngdoc factory
 * @name userIsLoggedOutInterceptor
 *
 * @requires $window
 *
 * @description
 *
 * This interceptor is used to identify when the session expired and the user
 * is logged out. We
 *
 */
d2Rest.factory('userIsLoggedOutInterceptor', function ($window) {
    return {
        'response': function (response) {
            if (response && typeof response.data === 'string' &&
                response.data.indexOf('<body class="loginPage">') >= 0) {
                $window.location.reload();
            }

            return response;
        }
    }
});

/**
 * Set the default base url
 */
d2Rest.config(function (d2ApiProvider) {
    d2ApiProvider.setBaseUrl('/dhis/api');
});

d2Rest.config(function ($httpProvider) {
    $httpProvider.interceptors.push('userIsLoggedOutInterceptor');
});
