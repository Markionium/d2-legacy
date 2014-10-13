/* global d2 */
/**
 * @ngdoc directive
 * @name recordTable
 *
 * @restrict E
 * @scope
 *
 * @description
 *
 * Flexible table directive to show data from an array of objects or a {@link d2-rest/d2Api} service.
 *
 * The table can be configured by setting the `tableConfig` attribute to an object on the `$scope`.
 * The tableConfig object can contain a `columns` array with objects that describe the columns.
 *
 * An example of such a column config can look like
 <pre class="prettyprint">
 <code class="language-js">$scope.tableConfig = {
            columns: [
                { name: 'name', sortable: true, searchable: true },
                { name: 'code', sortable: true, searchable: true },
                { name: 'lastUpdated' }
            ]
        };</code>
 </pre>
 *
 * The above example defines three columns. `name`, `code` and `lastUpdated`. The first two columns are
 * marked to be sortable and searchable. Sortable will mean that the table can be sorted on the values
 * in this column. (Sorting will be done in ASC and DESC order.
 * Searchable means a input box will be added to the table column and the user can search through this table.
 *
 * When angular-ui is available the searchbox will also use the typeahead functionality.
 *
 * ## Events
 *
 * Record table has a couple events that can be used to interact with the table
 *
 * ### Events to listen to
 * `RECORDTABLE.selection.changed` Emits an event upwards to notify that the selection has changed. This event
 * passes the selected items as data to the listeners.
 *
 * ### Events that the table listens for
 * `RECORDTABLE.selection.clear` Can be broadcasted to the record table to clear it's selection.
 *
 * @example
 <example name="recordTable" deps="ui-bootstrap-tpls.js" module="table">
    <file name="index.html">
        <div ng-controller="appCtrl">
            <record-Table table-data="someData"></record-table>
        </div>
    </file>
    <file name="app.js">
        var app = angular.module('table', ['d2-recordtable']);

        app.controller('appCtrl', function ($scope) {
             $scope.someData = [
                {
                    "name": "ANC 1st visit",
                    "code": "DE_359596"
                },
                {
                    "name": "ANC 2nd visit",
                    "code": "DE_359597"
                },
                {
                    "name": "ANC 3rd visit",
                    "code": "DE_359598"
                },
                {
                    "name": "ANC 4th or more visits",
                    "code": "DE_359599"
                },
                {
                    "name": "Albendazole given at ANC (2nd trimester)",
                    "code": "DE_359602"
                },
                {
                    "name": "Expected pregnancies",
                    "code": "DE_20899"
                }
            ];
        });
    </file>
 </example>

 <example name="recordTable" deps="ui-bootstrap-tpls.js" module="table">
     <file name="index.html">
         <div ng-controller="appCtrl">
             <record-Table table-config="someConfig" table-data="someData"></record-table>
         </div>
     </file>
     <file name="app.js">
         var app = angular.module('table', ['d2-recordtable']);

        app.controller('appCtrl', function ($scope) {
            $scope.someConfig = {
                pageItems: 2
            };

            $scope.someData = [
                {
                    "name": "ANC 1st visit",
                    "code": "DE_359596"
                },
                {
                    "name": "ANC 2nd visit",
                    "code": "DE_359597"
                },
                {
                    "name": "ANC 3rd visit",
                    "code": "DE_359598"
                },
                {
                    "name": "ANC 4th or more visits",
                    "code": "DE_359599"
                },
                {
                    "name": "Albendazole given at ANC (2nd trimester)",
                    "code": "DE_359602"
                },
                {
                    "name": "Expected pregnancies",
                    "code": "DE_20899"
                }
            ];
        });
     </file>
 </example>
 */
function recordTable() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tableConfig: '=',
            tableDataSource: '=tableDataSource',
            contextMenu: '=tableContextMenu'
        },
        templateUrl: d2.scriptPath() + 'common/recordtable/recordtable.html',
        controllerAs: 'recordTable',
        controller: 'RecordTableController',
        link: function (scope, element, attrs, controller) {
            controller.parseTableConfig();
            controller.parseTableData();
        }
    };
}

angular.module('d2-recordtable').directive('recordTable', recordTable);
