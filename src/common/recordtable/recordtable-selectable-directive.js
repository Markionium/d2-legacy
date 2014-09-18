function recordTableSelectable($parse) {
    function selectOne(item) {
        return function () {
            item.selected = true;
        };
    }

    return {
        restrict: 'E',
        replace: true,
        require: '^recordTable',
        scope: true,
        template: '<input type="checkbox" ng-checked="item.selected" />',
        link: function (scope, element, attrs, controller) {
            //We use parse because we still want to get the item if it's there but dont want to isolate
            //the scope.
            scope.item = $parse(attrs.item)(scope);

            if (scope.item) {
                controller.rowClick = selectOne(scope.item);
            } else {
                element.click(function () {
                    scope.$apply(controller.selectAll());
                });
            }
        }
    };
}

angular.module('d2-recordtable').directive('recordTableSelectable', recordTableSelectable);
