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
 *
 * <d2-header-bar></d2-header-bar>
 */
d2HeaderBar.directive('headerBar', function () {
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
