/**
 * @ngdoc controller
 * @name RecordTableController
 *
 * @description
 *
 * TODO: Document the rest of this Controller.
 */
d2RecordTable.controller('RecordTableController', function ($scope, $q, $filter, $timeout, typeAheadService) {
    var self = this;

    this.localData = true;

    this.origData = [];
    this.typeAheadCache = typeAheadService;

    $scope.items = [];

    /**
     * @ngdoc method
     * @name RecordTableController#getHeadersFromData
     *
     * @returns {Array|*}
     *
     * @description
     *
     * Generates the header names based on the data that is given to the table.
     */
    this.getHeadersFromData = function () {
        var columns = [];

        _.map($scope.items, function (object) {
            var data = object.getDataOnly ? object.getDataOnly() : object;
            _.map(data, function (value, key) {
                columns.push({
                    name: key
                });
            });
            return columns;
        });
        columns = _.uniq(columns, function (column) {
            return column.name;
        });

        $scope.columns = columns;
        return $scope.columns;
    };
    /**
     * @ngdoc method
     * @name RecordTableController#parseTableConfig
     *
     * @returns {RecordTableController} Returns itself for chaining purposes
     *
     * @description
     *
     * Parses the tableData variable on the scope to extract
     * the data we need and puts it on the scope directly
     */
    this.parseTableConfig = function () {
        var tableConfig = $scope.tableConfig || {};

        $scope.pageItems = tableConfig.pageItems;
        $scope.columns = tableConfig.columns || undefined;

        return this;
    };

    /**
     * @ngdoc method
     * @name RecordTableController#parseTableData
     *
     * @returns {RecordTableController} Returns itself for chaining purposes
     *
     * @description
     *
     * Wraps the table data is a promise and adds the processData handler
     */
    this.parseTableData = function () {
        //If tableData is a d2 service
        if (angular.isArray($scope.tableData) && $scope.tableData.getList !== undefined) {
            this.localData = false;
            $scope.d2Service = $scope.tableData;
            $scope.tableData = $scope.d2Service.getList(this.getRemoteParams());
        }

        $q.when($scope.tableData).then(this.processData.bind(this));

        return this;
    };

    /**
     * @ngdoc method
     * @name RecordTableController#processData
     *
     * @param {array} data The data that will be used for the table.
     *
     * @returns {RecordTableController} Returns itself for chaining purposes
     *
     * @description
     *
     * Takes the data and takes/generates needed meta data from it. This method will generate
     * the table headers if they are not already set.
     * Additionally it will generate the typeahead values from the data for each of the columns.
     *
     * TODO: The typeahead data should only be generate for columns that actually use it
     * TODO: The typeahead data should only be generated when typeahead is actually available.
     */
    this.processData = function (data) {
        $scope.items = this.origData = data;
        $scope.columns = $scope.columns || this.getHeadersFromData();

        if ($scope.pageItems) {
            $scope.items = $scope.items.slice(0, $scope.pageItems);
        }

        angular.forEach($scope.columns, function (column) {
            self.typeAheadCache.add(column.name, self.getValuesForColumn(column));
        });

        return this;
    };

    /**
     * @ngdoc method
     * @name RecordTableController#setSortOrder
     *
     * @param {object} currentColumn The column that the sorting should be set for
     *
     * @returns {RecordTableController} Returns itself for chaining purposes
     *
     * @description
     *
     * Method resets the sorting of all columns to undefined and sets the sort property
     * of the passed in column to either `desc` or `asc`.
     *
     * `desc` and `asc` are toggled, with asc taking the first turn if there is no current sort.
     */
    this.setSortOrder = function (currentColumn) {
        var columns = angular.copy($scope.columns);

        angular.forEach(columns, function (column) {
            if (column.name === currentColumn.name) {
                if (currentColumn.sort === 'asc') {
                    column.sort = 'desc';
                } else {
                    column.sort = 'asc';
                }
            } else {
                column.sort = undefined;
            }
        });

        $scope.columns = columns;
    };

    /**
     * @ngdoc method
     * @name RecordTableController#getColumnsWithFilters
     *
     * @returns {Array} An array of columns that have the searchable property set to `true`.
     *
     * @description
     *
     * Filters out all the columns that have the `searchable` property set to true and returns them.
     */
    this.getColumnsWithFilters = function () {
        return _.filter($scope.columns, 'searchable');
    };

    this.getFilterObject = function () {
        var filters = this.getColumnsWithFilters(),
            filterObject = {};

        if (filters.length === 0) return false;

        angular.forEach(filters, function (column) {
            filterObject[column.name] = column.filter;
        });

        return filterObject;
    };

    this.getRemoteFilters = function () {
        var filters = [];

        if (!this.getFilterObject()) return;
        angular.forEach(this.getFilterObject(), function (filterValue, filterOn) {
            if (filterValue) {
                filters.push(filterOn + ":like:" + filterValue);
            }
        });

        return filters.length > 0 ? filters : undefined;
    };

    this.getRemoteParams = function () {
        var remoteParams = {},
            remoteFilters = this.getRemoteFilters();

        if (remoteFilters) {
            remoteParams.filter = remoteFilters;
        }

        if (remoteFilters) {
            return remoteParams;
        }
        return undefined;
    };

    this.requestNewDataFromService = function () {
        var remoteParams = this.getRemoteParams();

        $scope.tableData = $scope.d2Service.getList(remoteParams);
        $q.when($scope.tableData).then(this.processData.bind(this));
    }

    this.doLocalFiltering = function () {
        if (this.getFilterObject()) {
            $scope.items = $filter('filter')(this.origData, this.getFilterObject());
        }
    };

    this.doLocalSorting = function () {
        var sorting = _.filter($scope.columns, 'sort'),
            sortBy = _.pluck(sorting, 'name'),
            items;

        //Don't do anything when there is no sorting to be done
        if (sorting.length === 0) return;

        items = _.sortBy($scope.items, sortBy);
        if (sorting[0] && sorting[0].sort === 'desc') {
            items = items.reverse();
        }

        $scope.items = items;
    };

    /**
     * TODO: Api sorting is coming to 2.17 so we cannot test this yet
     * @see https://blueprints.launchpad.net/dhis2/+spec/webapi-ordering-of-properties
     */
    this.serviceSorting = function () {
        var sorting = _.filter($scope.columns, 'sort'),
            sortBy = _.pluck(sorting, 'name');

        //Don't do anything when there is no sorting to be done
        if (sorting.length === 0) return;

        alert('API Sorting not yet implemented');
    };

    this.getValuesForColumn = function (column) {
        if (!column || !column.name || !angular.isString(column.name)) {
            return []
        }
        ;

        return _.map($scope.items, function (item) {
            return item[column.name];
        });
    };

    var timeout = false;
    $scope.$watch('columns', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            if (self.localData) {
                self.doLocalFiltering();
                self.doLocalSorting();
            }
            if ($scope.d2Service) {
                if (!timeout) {
                    $timeout(function () {
                        self.requestNewDataFromService();
                        timeout = false;
                    }, 300);
                    timeout = true;
                }
            }
        }
        ;
    }, true);
});

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
 */
d2RecordTable.directive('recordTable', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tableConfig: '=',
            tableData: '='
        },
        templateUrl: d2.scriptPath() + 'common/recordtable/recordtable.html',
        controller: 'RecordTableController',
        link: function (scope, element, attrs, controller) {
            controller.parseTableConfig();
            controller.parseTableData();
        }
    };
});
