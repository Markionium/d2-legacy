function recordTableRowsDirective() {

    function addRows(scope, element) {
        var rows = [];

        if (!angular.isArray(columns) || !angular.isArray(items)) { return true; }

        angular.forEach(items, function (item) {
            var row = angular.element('<tr ng-click="item.click()"></tr>');
            angular.forEach(columns, function (column) {
                row.append(angular.element('<td>' + item[column.name] + '</td>'));
            });
            rows.push(row);
        });

        element.children().remove();
        element.append(rows);
        return rows;
    }

    return {
        restrict: 'A',
        link: function (scope, element) {
            addRows(scope.tableConfig.columns, scope.items, element)
        }
    };
}

angular.module('d2-recordtable').directive('recordTableRows', recordTableRowsDirective);
