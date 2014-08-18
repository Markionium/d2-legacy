angular.module('d2-filters').filter('capitalize', function () {
    return function (input) {
        if (angular.isString(input)) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
        return input;
    };
});
