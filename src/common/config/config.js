/* global d2Config */
d2Config.constant('API_ENDPOINT', '/dhis/api');
d2Config.factory('apiConfig', function (API_ENDPOINT) {
    return {
        getUrl: function (resource) {
            if ( ! angular.isString(resource)) {
                throw 'Api Config Error: Resource URL should be a string';
            }
            if (resource[0] === '/') {
                resource = resource.substr(1);
            }
            return [API_ENDPOINT, resource].join('/');
        }
    };
});
