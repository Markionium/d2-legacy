function recordTableBodyDirective($compile) {

    function createTrNode(index) {
        var trNode = document.createElement('tr');
        trNode.setAttribute('ng-click', 'recordTable.rowClick(tableData.items[' + index + '])');
        return trNode;
    }

    function createTdNodeWithContent(content) {
        var textNode = document.createTextNode(content);
        var tdNode = document.createElement('td');

        tdNode.appendChild(textNode);

        return tdNode;
    }

    function createCheckboxNode(index) {
        var cellNode = document.createElement('td');
        var inputNode = document.createElement('input');

        inputNode.setAttribute('type', 'checkbox');
        inputNode.setAttribute('ng-model', 'tableData.items[' + index + '].selected');
        inputNode.setAttribute('ng-change', 'recordTable.checkAllSelected()');

        cellNode.appendChild(inputNode);
        return cellNode;
    }

    function addRows(columns, items, element, scope) {
        var trNode;
        var rows = document.createDocumentFragment();

        if (!angular.isArray(columns) || !angular.isArray(items)) {
            return true;
        }
        angular.forEach(items, function (item, index) {
            var cells = document.createDocumentFragment();
            trNode = createTrNode(index);

            angular.forEach(columns, function (column) {
                if (column.checkbox && scope.tableConfig.select) {
                    cells.appendChild(createCheckboxNode(index));
                } else {
                    cells.appendChild(createTdNodeWithContent(item[column.name] || ''));
                }
            });

            trNode.appendChild(cells);
            rows.appendChild(trNode);
        });

        element.children().remove();
        element.append($compile(angular.element(rows))(scope));
    }

    return {
        restrict: 'A',
        require: '^recordTable',
        link: function (scope, element) {
            addRows(scope.tableConfig.columns, scope.items, element);
            scope.$watch('tableData.items', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (angular.isArray(scope.tableConfig.columns)) {
                        addRows(scope.tableConfig.columns, scope.tableData.items, element, scope);
                    }
                }
            });

            scope.$watch('tableConfig.columns', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (angular.isArray(scope.tableData.items)) {
                        addRows(scope.tableConfig.columns, scope.tableData.items, element, scope);
                    }
                }
            });
        }
    };
}

angular.module('d2-recordtable').directive('recordTableBody', recordTableBodyDirective);
