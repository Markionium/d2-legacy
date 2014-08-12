/**
 * @ngdoc directive
 * @name detailsBox
 *
 * @restrict EA
 * @scope
 *
 * @param {Object} details The simple object with key/value pays of items that you want shown.
 * The keys (property names) will become the headers and the values for those will become the content.
 * @param {Array=} headers This will have a list of the items that should be shown.
 *
 * @describe
 *
 * Displays a list of details that are passed in as an object. It will create a div for each of the properties.
 * Each of these will get a `header` and a `content` field.
 */
d2DetailsBox.directive('detailsBox', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            details: "=",
            headers: "="
        },
        templateUrl: d2.scriptPath() + 'common/detailsbox/detailsbox.html',
        controller: function ($scope) {
            var self = this;

            this.parseDetailsToArray = function () {
                var filteredList = $scope.details;

                if (angular.isArray($scope.headers) && $scope.headers.length > 0) {
                    filteredList = _.pick($scope.details, $scope.headers);
                }

                $scope.valueList = _.map(filteredList, function (value, key) {
                    return {
                        "key": key,
                        "value": value
                    };
                });
            };

            this.parseDetailsToArray();

            $scope.$watch('details', function (newVal, oldVal) {
                if (newVal === oldVal) return;
                self.parseDetailsToArray();
            });
        }
    };
});
