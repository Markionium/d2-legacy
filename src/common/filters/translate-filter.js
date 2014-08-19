
/**
 * @ngdoc filter
 * @name translate
 *
 * @requires d2-filters#capitalize
 *
 * @description
 *
 * This filter is a place holder for the `translate` filter that we support. This empty filter is provided because of the way how filters work in AngularJS.
 *
 * This filter will not do anything
 *
 * {@note warning This does NOT translate.
 *  Because this is a placeholder filter it only capitalizes given strings.
 *  To add translation functionality add the `d2-translate` module to your app.
 * }
 */
function translate(capitalizeFilter) {
    return function (input) {
        return capitalizeFilter(input);
    };
}

angular.module('d2-filters').filter('translate', translate);
