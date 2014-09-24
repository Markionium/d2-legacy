/* global d2 */
function periodSelectorDirective(periodService) {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        templateUrl: d2.scriptPath() + 'common/period/periodselector.html',
        link: function (scope) {
            scope.period = {
                selectedPeriodType: undefined,
                selectedPeriod: undefined,
                periodTypes: periodService.getPeriodTypes(),
                periodsRecentFirst: periodService.getPastPeriodsRecentFirst()
            };

            scope.$watch(function () {
                return periodService.getPeriodTypes();
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    scope.period.periodTypes = periodService.getPeriodTypes();
                }
            });

            scope.changedPeriodType = function ($item) {
                periodService.setPeriodType($item);
                scope.period.periodsRecentFirst = periodService.getPastPeriodsRecentFirst();

                //Always select the first period when a new type is picked
                scope.period.selectedPeriod = scope.period.periodsRecentFirst[0];
                scope.changePeriod(scope.period.selectedPeriod);
            };

            scope.changePeriod = function ($item) {
                if ($item === undefined) {
                    return;
                }

                periodService.period = $item;
            };
        }
    };
}

angular.module('d2-period').directive('periodSelector', periodSelectorDirective);
