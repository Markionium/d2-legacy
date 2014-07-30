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
 */
d2BreadCrumbs.directive('breadCrumbs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            homeCrumb: "="
        },
        //For testing this resolves to 'common/breadcrumbs/breadcrumbs.html'
        templateUrl: d2.scriptPath() + 'common/breadcrumbs/breadcrumbs.html',
        controller: function ($scope, $location, breadCrumbsService) {
            $scope.crumbClick = function (crumb) {
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
    };
});
