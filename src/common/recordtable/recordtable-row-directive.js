function recordTableRowsDirective() {

    function updateRows(items, columns, element) {
        var rows = [];

        if (!angular.isArray(columns)) {
            //console.log('no columns');
            return true;
        }
        if (!angular.isArray(items)) {
            //console.log('no items');
            return true;
        }

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
        scope: false,
        link: function (scope, element) {
            updateRows(scope.items, scope.columns, element);
            function update(newVal, oldVal) {
                if (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]) {
                    updateRows(scope.items, scope.columns, element);
                }
            }

            scope.$watchCollection('[items, columns]', update, true);

        }
    };
}

angular.module('d2-recordtable').directive('recordTableRows', recordTableRowsDirective);
