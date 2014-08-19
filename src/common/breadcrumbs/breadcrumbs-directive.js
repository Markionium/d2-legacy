/* global d2 */
/**
 * @ngdoc controller
 * @name breadCrumbs
 *
 * @param {Object} $scope Angular scope object. Isolated scope for this directive
 * @param {Object} breadCrumbsService Breadcrumb service that contains the breadcrumb logic {@link breadCrumbService}
 *
 * @description
 *
 * Controller for the breadcrumbs directive
 */
function breadCrumbs($scope, breadCrumbsService) {
    /**
     * @ngdoc method
     * @name breadCrumbs#crumbClick
     *
     * @param {Object} crumb The crumb object corresponding to the crumb that was clicked on.
     *
     * @description
     *
     * Callback for when a bread crumb is clicked on.
     * It removes the breadcrumbs after the one that was clicked on and then calls the crumbs click handler that was
     * specified when creating the crumb.
     */
    this.crumbClick = function (crumb) {
        breadCrumbsService.resetCrumbs(crumb.id);

        if (crumb.click) {
            crumb.click(angular.copy(crumb));
        }
    };

    $scope.$watchCollection(function () {
        return breadCrumbsService.getCrumbsList();
    }, function (newValue) {
        $scope.crumbsList = newValue;
    });
}

/**
 * @ngdoc directive
 * @name breadCrumbs
 *
 * @requires breadCrumbsService
 *
 * @restrict E
 * @scope
 *
 * @param {Object} crumbsList A instance of {@link breadCrumbsService}
 *
 * @description
 *
 * Directive to show a list of breadcrumbs at the place where the directive is inserted.
 * The breadcrumbs crumbs can be modified by using the {@link breadCrumbsService}
 *
 * @example
    <example name="bread-crumbs" module="bread">
        <file name="index.html">
            <div ng-controller="appCtrl">
                <bread-crumbs></bread-crumbs>
            </div>
        </file>
        <file name="appController.js">
            var app = angular.module('bread', ['d2-breadcrumbs'])

            app.controller('appCtrl', function (breadCrumbsService) {
                 breadCrumbsService.addCrumb('Home');
                 breadCrumbsService.addCrumb('Data Indicators', function () {
                     alert('Data Indicators');
                 });
            });
        </file>
        <file name="styles.css">
            .crumb:after {
                content: " > "
            }
        </file>
    </example>
 */
angular.module('d2-breadcrumbs').directive('breadCrumbs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            homeCrumb: '='
        },
        templateUrl: d2.scriptPath() + 'common/breadcrumbs/breadcrumbs.html',
        controllerAs: 'breadCrumbs',
        controller: breadCrumbs
    };
});
