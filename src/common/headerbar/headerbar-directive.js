/* global d2 */
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
function headerBar() {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '=',
            link: '=',
            logo: '='
        },
        templateUrl: d2.scriptPath() + 'common/headerbar/headerbar.html',
        link: function (scope) {
            scope.headerTitle = scope.title || 'District Health Information Software 2';
            scope.headerLink = scope.link || '../dhis-web-dashboard-integration/index.action';
            scope.headerLogo = scope.logo || '../dhis-web-commons/css/light_blue/logo_banner.png';
        }
    };
}

angular.module('d2-headerbar').directive('headerBar', headerBar);
