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
        restrict: 'A',
        replace: true,
        require: '^recordTable',
        transclude: true,
        scope: false,
        template: [
            '<th class="table-header">',
            '<a ng-if="column.sortable && !column.checkbox" ng-click="sortOrder()" href="#" ng-transclude ng-class="\'sorting-\' + column.sort" translate></a>',
            '<span ng-if="!column.sortable && !column.checkbox" ng-transclude></span>',
            '<input ng-if="column.searchable && !column.checkbox" ng-model="column.filter" type="text" ng-class="tableConfig.headerInputClass"' +
                ' typeahead="name for name in getTypeAheadFor(column) | filter:$viewValue | limitTo:8">',
            '<input type="checkbox" ng-if="column.checkbox" />',
            '</th>'
        ].join(''),

        link: function (scope, element, attr, parentCtrl) {
            scope.sortOrder = function () {
                parentCtrl.setSortOrder(scope.column);
            };

            scope.getTypeAheadFor = function (column) {
                return parentCtrl.typeAheadCache[column.name];
            };

            element.bind('click', 'input', function () {
                parentCtrl.selectAll();
                //console.log(parentCtrl.getItems());
            });
        }
    };
}

angular.module('d2-recordtable').directive('recordTableHeader', recordTableHeader);
