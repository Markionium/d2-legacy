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
function recordTableHeader($compile, $parse) {
    function buildColumnHeader(index, scope) {
        var template = [
            '<th class="table-header">',
            '<a ng-show="tableConfig.columns[' + index + '].sortable && !tableConfig.columns[' + index + '].checkbox" href="#" ng-class="\'sorting-\' + tableConfig.columns[' + index + '].sort" ',
            'translate ng-bind="tableConfig.columns[' + index + '].name"></a>',
            '<span ng-show="!tableConfig.columns[' + index + '].sortable && !tableConfig.columns[' + index + '].checkbox" ng-bind="tableConfig.columns[' + index + '].name"></span>',
            '<input ng-show="tableConfig.columns[' + index + '].searchable && !tableConfig.columns[' + index + '].checkbox" ng-model="tableConfig.columns[' + index + '].filter" type="text" ',
            'ng-class="tableConfig.headerInputClass"',
            ' typeahead="name for name in getTypeAheadFor(tableConfig.columns[' + index + ']) | filter:$viewValue | limitTo:8"  placeholder="Search in {{tableConfig.columns[' + index + '].name}}">',
            '<input type="checkbox" ng-show="tableConfig.select && tableConfig.columns[' + index + '].checkbox" ng-model="recordTable.allSelected" ng-change="recordTable.selectAll()" />',
            '</th>'
        ].join('');
        var element = angular.element(template);

        return $compile(element)(scope);
    }

    function createHeaders(scope, element, parentCtrl) {
        if (angular.isArray(scope.tableConfig.columns)) {
            var rowElement = angular.element('<tr></tr>');
            angular.forEach(scope.tableConfig.columns, function (column, index) {
                rowElement.append(buildColumnHeader(index, scope));
            });
            if (element.children().length > 0) {
                element.children().replaceWith(rowElement);
            } else {
                element.append(rowElement);
            }

            element.find('a').bind('click', function (event) {
                var exp = ''.replace.apply(angular.element(event.target).attr('ng-bind'), ['.name', '']);
                if (angular.isString(exp)) {
                    scope.$apply(function () {
                        parentCtrl.setSortOrder($parse(exp)(scope));
                    });
                }

            });
        }
    }

    return {
        restrict: 'A',
        require: '^recordTable',
        link: {
            pre: function (scope, element, attr, parentCtrl) {
                createHeaders(scope, element, parentCtrl);

                //Update the headers when columns are added
                scope.$watch('tableConfig.columns.length', function (/*newVal, oldVal*/) {
                    //TODO: This might not be the most efficient way
                    //new and old however seem to return the same value
                    createHeaders(scope, element, parentCtrl);
                }, true);

                scope.getTypeAheadFor = function (column) {
                    return parentCtrl.typeAheadCache[column.name];
                };
            }
        }
    };
}

angular.module('d2-recordtable').directive('recordTableHeader', recordTableHeader);
