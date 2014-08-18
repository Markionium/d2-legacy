/* global d2 */
/**
 * @ngdoc module
 * @name d2-headerbar
 *
 *
 * @description
 *
 * # d2-headerbar
 *
 * This module contains the directive for the headerbar
 * the headerbar does not have any services therefore this is the only
 * directive currently in this module.
 */
angular.module('d2-headerbar', []);

/**
 * @ngdoc directive
 * @name headerBar
 *
 * @restrict E
 * @scope
 *
 * @description
 *
 * This directive represents the headerbar in dhis
 *
 * @example
 This example specifies the most basic usage of the detailsbox. It passes an object and displays it's properties.

 <example module="d2-headerbar">
 <file name="index.html">
    <header-bar logo="https://www.dhis2.org/sites/all/themes/dhis/logo.png"></header-bar>
 </file>
 </example>
 */
angular.module('d2-headerbar').directive('headerBar', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            link: '@',
            logo: '@',
            hasContent: '@'
        },
        templateUrl: d2.scriptPath() + 'common/headerbar/headerbar.html',
        compile: function (element, attrs) {
            attrs.title = attrs.title || 'District Health Information Software 2';
            attrs.link = attrs.link || '../dhis-web-dashboard-integration/index.action';
            attrs.logo = attrs.logo || '../dhis-web-commons/css/light_blue/logo_banner.png';
        }
    };
});
