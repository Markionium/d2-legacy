/* global d2 */
/**
 * @ngdoc directive
 * @name introList
 *
 * @scope
 * @restrict E
 *
 * @param {Array} itemList The itemList passed in should be a array with objects of the following format
 * <pre class="prettyprint">
 *     <code class="language-js">{
     *       action: <string>       // Url of where the link should go to
     *       name: <string>         // Name of the item that will be displayed
     *       description: <string>  // Description of the menu items
     *       icon: <string>         // Icon that should be shown
     * }</code>
 * </pre>
 *
 * @description
 *
 * Directive to create a list menu items with a small intro text and an icon.
 *
 * TODO: ADD Picture
 */
angular.module('d2-introlist').directive('introList', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            itemList: '=',
            itemClick: '&'
        },
        templateUrl: d2.scriptPath() + 'common/introlist/introlist.html',
        link: function (scope) {
            scope.clickFunction = function (item) {
                var itemToPass = {item: angular.copy(item)};
                scope.itemClick(itemToPass);
            };
        }
    };
});
