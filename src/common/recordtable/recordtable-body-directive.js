function recordTableBodyDirective($compile) {

    function addRows(columns, items, element, scope) {
        var rows = [];

        if (!angular.isArray(columns) || !angular.isArray(items)) { return true; }
        angular.forEach(items, function (item, index) {
            var row = angular.element('<tr ng-click="recordTable.rowClick(tableData.items[' + index + '])"></tr>');
            angular.forEach(columns, function (column) {
                if (column.checkbox && scope.tableConfig.select) {
                    row.append(angular.element('<td><input type="checkbox" ng-model="tableData.items[' + index + '].selected" ng-change="recordTable.checkAllSelected()" /></td>'));
                } else {
                    row.append(angular.element('<td>' + (item[column.name] || '') + '</td>'));
                }
            });
            rows.push($compile(row)(scope));
        });

        element.children().remove();
        element.append(rows);
    }

    return {
        restrict: 'A',
        require: '^recordTable',
        link: function (scope, element) {
            addRows(scope.tableConfig.columns, scope.items, element);
            scope.$watch('tableData.items', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (angular.isArray(scope.tableConfig.columns))
                        addRows(scope.tableConfig.columns, scope.tableData.items, element, scope);
                }
            });

            scope.$watch('tableConfig.columns', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (angular.isArray(scope.tableData.items))
                        addRows(scope.tableConfig.columns, scope.tableData.items, element,scope);
                }
            });
        }
    };
}

angular.module('d2-recordtable').directive('recordTableBody', recordTableBodyDirective);
