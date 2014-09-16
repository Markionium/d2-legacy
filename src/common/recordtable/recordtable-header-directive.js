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
 * #Sorting
 *
 * The directive adds the sort functionality and calls the setSortOrder function on {@link RecordTableController}.
 *
 * #Searchable columns
 * An input box with be added to the column header when `column.searchable` is set to true.
 *
 * A class can be configured in the tableConfig that is passed to the recordTable directive to add a class to the input boxes.
 * When adding a property `headerInputClass` to the tableConfig this class will be added to the input searchboxes.
 *
 * #Typeahead
 * When typeahead is available it asks for the typeahead values on {@link RecordTableController} through the `typeAheadCache` property.
 */
function recordTableHeader() {
    return {
        restrict: 'AC',
        replace: true,
        require: '^recordTable',
        transclude: true,
        scope: {
            column: '=',
            config: '='
        },

        template: [
            '<th class="table-header">',
            '<a ng-click="sortOrder()" href="#" ng-if="column.sortable" ng-transclude ng-class="\'sorting-\' + column.sort" translate></a>',
            '<span ng-if="!column.sortable" ng-transclude></span>',
            '<input ng-if="column.searchable" ng-model="column.filter" type="text" ng-class="config.headerInputClass" typeahead="name for name in getTypeAheadFor(column) | filter:$viewValue | limitTo:8">',
            '</th>'
        ].join(''),

        link: function (scope, element, attr, parentCtrl) {
            scope.sortOrder = function () {
                parentCtrl.setSortOrder(scope.column);
            };

            scope.getTypeAheadFor = function (column) {
                return parentCtrl.typeAheadCache[column.name];
            };
        }
    };
}

angular.module('d2-recordtable').directive('recordTableHeader', recordTableHeader);
