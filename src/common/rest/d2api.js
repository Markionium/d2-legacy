/**
 * @ngdoc provider
 * @name d2ApiProvider
 *
 * @description
 *
 * This is the d2Api "provider" that can be used to configure the d2Api. The provider will expose
 * the restangularProvider through the `config` property.
 *
 * When the provider is called by angular it will do some default configuration specific for the
 * dhis2 api. This should make it more convenient for you to use the d2Api to get data from the
 * dhis2 api.
 */
function d2Api(RestangularProvider) {

    /*****************************************************************************
     * Provided Object definition
     */

    /**
     * @ngdoc service
     * @name d2Api
     *
     * @description
     *
     * This service will be used to communicate with the dhis2-api.
     *
     * ##Detailed description
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
         * @ngdoc method
         * @name d2Api#addEndPoint
         *
         * @param {string} endPointName The name of this endpoint
         * @param {boolean=} isObject If the result is a single object
         *
         * @description
         *
         * This allows you to add an endpoint to the rest service. The endpoint takes a name that
         * is used for the endpoint and a boolean that respresents if the response is an object
         * instead of a list of objects.
         *
         * ###Errors
         *
         * The `addEndPoint` method will throw the following errors
         *
         * #### D2Api Error: EndPoint should not have a leading slash
         * When the endpoint is passed in with a leading slash.
         * Like `addEndPoint('/dataElement')` would throw this error.
         *
         * #### D2Api Error: EndPoint &lt;endPointName&gt; already exists
         * When trying to add an endpoint that already exists it will throw an error.
         * `D2Api Error: EndPoint "' + endPointName + '" already exists`
         *
         * {@note warning Nameing convention
         * The name that is passed in as the endPointName should be the name as it is used in the url.
         * Therefore when trying to create and endpoint for the dataElement api located at
         * `/dhis/api/dataElement`. You would specify the name as `dataElement`. Note the capital E.
         * If the endpoint were to be specified as `dataelement`, the service would call /dhis/api/dataelement.}
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

        /**
         * @ngdoc method
         * @name d2Api#getEndPoint
         *
         * @param {String=} endPointName
         *
         * @returns {Object}
         *
         * @description
         *
         * This will attempt to get an endpoint that is defined on the d2Api object.
         *
         * ### Errors
         *
         * #### D2Api Error: Endpoint does not exist
         * When the endpoint does not exist, trying to get it will throw the does not exist error.
         *
         * {@note info Exposed on object directly
         * The endpoint is also exposed directly on the d2Api object. So when trying to get the `indicators`
         * endpoint instead of using `getEndPoint('indicators')` you could also use `d2Api.indicators` directly.}
         */
        this.getEndPoint = function (endPointName) {
            if (this[endPointName] === undefined) {
                throw 'D2Api Error: Endpoint does not exist';
            }
            return this[endPointName];
        };

        /**
         * @ngdoc method
         * @name d2Api#hasEndPoint
         *
         * @description
         * Check if an endpoint is defined on the d2Api object.
         *
         * @param {String} endPointName The name of the endpoint to check
         * @returns {boolean} True when the endpoint exists, false when it does not.
         */
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
     * @ngdoc method
     * @name d2ApiProvider#config
     *
     * @param {String=} baseUrl
     *
     * @description
     *
     * Set a base url to be used with the api.
     */
    this.setBaseUrl = function (baseUrl) {
        this.config.setBaseUrl(baseUrl);
    };

    /**
     * @ngdoc method
     * @name d2ApiProvider#$get
     *
     * @param {Restangular} Restangular The restangular object instance that is
     *                                  configured through the restangular provider.
     * @returns {d2Api} d2Api This is the rest-api service that is provided after being configured
     *                        by the set providers.
     *
     * @description
     *
     * This is the provider method for the d2Api. This will create a new instance of the d2Api.
     * The D2Api is basically a wrapper object for Restangular with some dhis2 api
     * sugar methods and properties.
     */
    this.$get = function (Restangular) {
        var api;

        api = D2ApiRest;
        api.prototype = Restangular;

        return new D2ApiRest();
    };

    /**
     * @ngdoc property
     * @name d2ApiProvider#config
     *
     * @type {Object} RestangularProvider instance
     *
     * @description
     *
     * Expose the restangularProvider so settings can be set that we didn't expose
     * through shorthand methods.
     */
    this.config = RestangularProvider;

    /*****************************************************************************
     * Do some extra default configuration specific to our (DHIS2) Api
     */

    /**
     * Response interceptor that takes the data from the endpoint and extracts the meta
     * data that is wrapped around it.
     */
    this.config.addResponseInterceptor(function (data, operation, what) {
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

        if (newResponse) {
            newResponse.getDataOnly = function () {
                return dataOnly;
            };
        }

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
}

/**
 * TODO: find a way how to define requires that depend on angular modules/objects
 * The userIsLoggedOutInterceptor should have a requires statement that it depends on $window
 *
 * @requires $window
 */
/**
 * @ngdoc function
 * @name userIsLoggedOutInterceptor
 *
 *
 * @description
 *
 * This interceptor is used to identify when the session expired and the user
 * is logged out. We currently reload the page when the d2Rest service requests a page
 * that returns a response that contains the html fragment `<body class="loginPage">`.
 */
function userIsLoggedOutInterceptor($window) {
    return {
        response: function (response) {
            if (response && typeof response.data === 'string' &&
                response.data.indexOf('<body class="loginPage">') >= 0) {
                $window.location.reload();
            }

            return response;
        }
    };
}

function restConfig($httpProvider, d2ApiProvider) {
    $httpProvider.interceptors.push('userIsLoggedOutInterceptor');
    d2ApiProvider.setBaseUrl('/dhis/api');
}

angular.module('d2-rest').provider('d2Api', d2Api);
angular.module('d2-rest').factory('userIsLoggedOutInterceptor', userIsLoggedOutInterceptor);
angular.module('d2-rest').config(restConfig);
