/**
 * @ngdoc filter
 * @name capitalize
 *
 * @description
 *
 * Capitalizes the first letter of the given string.
 */
function capitalize() {
    return function (input) {
        if (angular.isString(input)) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
        return input;
    };
}

angular.module('d2-filters').filter('capitalize', capitalize);
