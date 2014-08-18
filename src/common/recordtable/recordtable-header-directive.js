var d2RecordTable = angular.module('d2-recordtable');

/**
 * @ngdoc directive
 * @name recordTableHeader
 *
 * @restrict AC
 * @scope
 *
 * @requires recordTable
 *
 * @description
 *
 * This directive represents the column headers as they are displayed by the {@link recordTable} directive.
 *
 * The directive adds the sort functionality and calls the setSortOrder function on {@link RecordTableController}.
 *
 * An input box with be added to the column header when `column.searchable` is set to true.
 *
 * When typeahead is available it asks for the typeahead values on {@link RecordTableController} through the `typeAheadCache` property.
 *
 */
d2RecordTable.directive('recordTableHeader', function () {
    return {
        restrict: 'AC',
        replace: true,
        require: '^recordTable',
        transclude: true,
        scope: {
            column: '='
        },
        template: '<th class="table-header"><a ng-click="sortOrder()" href="#" ng-if="column.sortable" ng-transclude ng-class="\'sorting-\' + column.sort" translate></a>' +
            '<span ng-if="!column.sortable" ng-transclude></span><input ng-if="column.searchable" ng-model="column.filter" type="text" ' +
            'typeahead="name for name in getTypeAheadFor(column) | filter:$viewValue | limitTo:8"></th>',
        link: function (scope, element, attr, parentCtrl) {
            scope.sortOrder = function () {
                parentCtrl.setSortOrder(scope.column);
            };

            scope.getTypeAheadFor = function (column) {
                return parentCtrl.typeAheadCache[column.name];
            };
        }
    };
});
