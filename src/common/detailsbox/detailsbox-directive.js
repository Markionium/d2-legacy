/**
 * @ngdoc directive
 * @name detailsBox
 *
 * @restrict EA
 * @scope
 *
 * @param {Array|Function} details
 *
 * @describe
 *
 * Displays a list of details that are passed in as
 */
d2DetailsBox.directive('detailsBox', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            details: "="
        },
        templateUrl: d2.scriptPath() + 'common/detailsbox/detailsbox.html',
        controller: function ($scope) {
            var self = this;

            $scope.valueList = [];

            this.parseDetailsToArray = function () {
                $scope.valueList = [];
                angular.forEach($scope.details, function (value, key) {
                    this.push({
                        "key": key,
                        "value": value
                    });
                }, $scope.valueList);
            };
            this.parseDetailsToArray();

            $scope.$watch('details', function (newVal, oldVal) {
                if (newVal === oldVal) return;
                self.parseDetailsToArray();
            });
        }
    };
});
