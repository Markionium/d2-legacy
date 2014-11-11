function recordTableBodyDirective(/*$compile*/) {
    function createTrNode(index) {
        var trNode = document.createElement('tr');
        //TODO: Add back in support for rowClick
        trNode.setAttribute('ng-click', 'recordTable.rowClick(tableData.items[' + index + '])');
        return trNode;
    }

    function createTdNodeWithContent(content) {
        var textNode = document.createTextNode(content);
        var tdNode = document.createElement('td');

        tdNode.appendChild(textNode);

        return tdNode;
    }

    function createCheckboxNode() {
        var cellNode = document.createElement('td');
        var inputNode = document.createElement('input');

        inputNode.setAttribute('type', 'checkbox');

        cellNode.appendChild(inputNode);
        return cellNode;
    }

    function addRows(columns, items, element, scope, recordTable) {
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
                    cells.appendChild(createCheckboxNode());
                } else {
                    cells.appendChild(createTdNodeWithContent(item[column.name] || ''));
                }
            });

            trNode.setAttribute('data-index', index);
            trNode.addEventListener('click', function () {
                var row = this;
                var index = parseInt(row.getAttribute('data-index'), 10);
                var checkBox = row.querySelector('input[type=checkbox]');

                scope.$apply(function () {
                    if (scope.tableData.items[index].selected === true) {
                        checkBox.checked = false;
                        scope.tableData.items[index].selected = false;

                        row.classList.remove('selected');
                    } else {
                        checkBox.checked = true;
                        scope.tableData.items[index].selected = true;

                        row.classList.add('selected');
                    }
                    recordTable.checkAllSelected();
                });
            });

            trNode.appendChild(cells);
            rows.appendChild(trNode);
        });

        element.children().remove();
        element.append(rows);
    }

    return {
        restrict: 'A',
        require: '^recordTable',
        link: function (scope, element, attrs, recordTable) {
            addRows(scope.tableConfig.columns, scope.items, element, recordTable);
            scope.$watch('tableData.items', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (angular.isArray(scope.tableConfig.columns)) {
                        addRows(scope.tableConfig.columns, scope.tableData.items, element, scope, recordTable);
                    }
                }
            });

            scope.$watch('tableConfig.columns', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (angular.isArray(scope.tableData.items)) {
                        addRows(scope.tableConfig.columns, scope.tableData.items, element, scope, recordTable);
                    }
                }
            });

            scope.$on('RECORDTABLE.selection.clear', function () {
                var itemRows = element[0].parentNode.querySelectorAll('tbody tr');

                [].forEach.call(itemRows, function (row) {
                    var checkBox = row.querySelector('input[type="checkbox"]');
                    if (recordTable.allSelected === true) {
                        checkBox.checked = true;
                        row.classList.add('selected');
                    } else {
                        checkBox.checked = false;
                        row.classList.remove('selected');
                    }
                });
            });
        }
    };
}

angular.module('d2-recordtable').directive('recordTableBody', recordTableBodyDirective);
