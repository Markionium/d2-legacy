function closableController($scope) {
    this.close = function () {
        $scope.toggleValue = !$scope.toggleValue;
    };
}

function closable() {
    return {
        restrict: 'A',
        controller: closableController,
        controllerAs: 'closable',
        scope: {
            toggleValue: '=closable'
        },
        link: function (scope, element, attr, controller) {
            var closeElement = angular.element('<span class="closable-button fa fa-times-circle-o"></span>');

            closeElement.on('click', function () {
                scope.$apply(function () {
                    controller.close();
                });
            });
            element.append(closeElement);
            element.addClass('closable');
        }
    };
}

angular.module('d2-ui-enhancements').directive('closable', closable);
