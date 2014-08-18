function apiConfig(API_ENDPOINT) {
    return {
        getUrl: function (resource) {
            if (!angular.isString(resource)) {
                throw 'Api Config Error: Resource URL should be a string';
            }
            if (resource[0] === '/') {
                resource = resource.substr(1);
            }
            return [API_ENDPOINT, resource].join('/');
        }
    };
}

angular.module('d2-config').constant('API_ENDPOINT', '/dhis/api');
angular.module('d2-config').factory('apiConfig', apiConfig);
