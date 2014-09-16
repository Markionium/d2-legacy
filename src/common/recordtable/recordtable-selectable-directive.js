function recordTableSelectable($parse) {
    function selectAll(items) {
        return function () {
            _.each(items, function (item) {
                item.selected = true;
            });
        };
    }

    function selectOne(item) {
        return function () {
            item.selected = true;
        };
    }

    return {
        restrict: 'E',
        replace: true,
        require: '^recordTable',
        scope: false,
        template: '<input type="checkbox" />',
        link: function (scope, element, attrs, controller) {
            //We use parse because we still want to get the item if it's there but dont want to isolate
            //the scope.
            var item = $parse(attrs.item)(scope);

            if (item) {
                controller.rowClick = selectOne(scope.item);
            }

            element.click(function () {
                scope.$apply(selectAll(scope.items));
            });
        }
    };
}

angular.module('d2-recordtable').directive('recordTableSelectable', recordTableSelectable);
