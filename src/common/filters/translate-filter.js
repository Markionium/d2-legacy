/**
 * @ngdoc filter
 * @name translate
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
angular.module('d2-filters').filter('translate', function (capitalizeFilter) {
    return function (input) {
        return capitalizeFilter(input);
    };
});
