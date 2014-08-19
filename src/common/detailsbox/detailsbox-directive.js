/* global d2 */
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
 * @description
 *
 * Displays a list of details that are passed in as an object. It will create a div for each of the properties.
 * Each of these will get a `header` and a `content` field.
 *
 * @example
 This example specifies the most basic usage of the detailsbox. It passes an object and displays it's properties.

 <example module="d2-detailsbox">
 <file name="index.html">
    <div ng-init="details = {
            'name': 'ANC 1st visit',
            'shortName': 'ANC 1st',
            'domainType': 'AGGREGATE',
            'numberType': 'number'
        }">
        <details-box details="details"></details-box>
    </div>
 </file>
 </example>

 @example
 This example specifies a list of headers to be displayed. This will filter the detail object and omit any keys not
 present in the headerList.

 <example module="d2-detailsbox">
 <file name="index.html">
     <div ng-init="details = {
                'name': 'ANC 1st visit',
                'shortName': 'ANC 1st',
                'domainType': 'AGGREGATE',
                'numberType': 'number'
            };
            headerList=['shortName', 'numberType']">
     <details-box details="details" headers="headerList"></details-box>
     </div>
 </file>
 </example>
 */
function detailsBox() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            details: '=',
            headers: '='
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
                        key: key,
                        value: value
                    };
                });
            };

            this.parseDetailsToArray();

            $scope.$watch('details', function (newVal, oldVal) {
                if (newVal === oldVal) { return; }
                self.parseDetailsToArray();
            });
        }
    };
}

angular.module('d2-detailsbox').directive('detailsBox', detailsBox);
