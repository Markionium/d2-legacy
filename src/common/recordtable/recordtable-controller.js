/**
 * @ngdoc controller
 * @name RecordTableController
 *
 * @description
 *
 * TODO: Document the rest of this Controller.
 */
//jshint maxstatements:40, maxcomplexity: 7
function RecordTableController($scope, $q, $filter, $timeout, typeAheadService) {
    var self = this,
        requestServiceTimeoutIsSet = false;

    this.localData = true;

    this.origData = [];
    this.typeAheadCache = typeAheadService;

    this.pager = {};
    this.contextMenu = $scope.contextMenu;

    //Boolean switch to keep track if all elements are selected
    this.allSelected = false;

    $scope.tableData = $scope.tableData || {};
    $scope.tableData.items = [];
    $scope.tableConfig = $scope.tableConfig || {};

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

        _.map($scope.tableData.items, function (object) {
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

        $scope.tableConfig.columns = columns;
        return $scope.tableConfig.columns;
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
        $scope.tableConfig.columns = tableConfig.columns || undefined;
        this.rowClick = tableConfig.rowClick;

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
        var promise;
        //If tableData is a d2 service
        if (angular.isArray($scope.tableDataSource) && $scope.tableDataSource.getList !== undefined) {
            this.localData = false;
            $scope.d2Service = $scope.tableDataSource;
            promise = $scope.d2Service.getList(this.getRemoteParams());
        } else {
            promise = $scope.tableDataSource;
        }

        $q.when(promise).then(this.processData.bind(this));

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
        $scope.tableData.items = this.origData = data;
        $scope.tableConfig = $scope.tableConfig || {};
        $scope.tableConfig.columns = $scope.tableConfig.columns || this.getHeadersFromData();

        if (this.isSelectable()) {
            this.allSelected = false;
            this.addSelectable();
        }

        if (angular.isNumber($scope.pageItems) && $scope.pageItems > 0) {
            $scope.tableData.items = $scope.tableData.items.slice(0, $scope.pageItems);
        }
        if (data && data.meta) {
            $scope.meta = data.meta;
            this.processMetaData();
        }

        angular.forEach($scope.tableConfig.columns, function (column) {
            self.typeAheadCache.add(column.name, self.getValuesForColumn(column));
        });

        if (data && this.localData) {
            this.pager = {
                currentPage: 1,
                resultTotal: data.length,
                itemsPerPage: $scope.pageItems
            };
        }

        return this;
    };

    /**
     * @ngdoc method
     * @name RecordTableController#isSelectable
     *
     * @returns {boolean} True if selection for this table is turned on
     *
     * @description
     *
     * Convenience method to check if selection for this table is enabled. When selection
     * is enabled the rows of the table will be selectable.
     */
    this.isSelectable = function () {
        if (angular.isDefined($scope.tableConfig) && $scope.tableConfig.select === true) {
            return true;
        }
        return false;
    };

    /**
     * @ngdoc method
     * @name RecordTableController#addSelectable
     *
     * @returns undefined
     *
     * @description
     *
     * Adds a `selected` property to each of the items currently in tableData.
     */
    this.addSelectable = function () {
        var selectableObject = {
            name: '',
            checkbox: true
        };

        if ($scope.tableConfig.columns[0].checkbox === true) { return; }

        $scope.tableConfig.columns = [selectableObject].concat($scope.tableConfig.columns);

        _.each($scope.tableData.items, function (item) {
            item.selected = false;
        });
    };

    /**
     * @ngdoc method
     * @name RecordTableController#isAllSelected
     *
     * @returns {boolean}
     *
     * @description
     *
     * Check if all the items in the table are selected.
     */
    this.isAllSelected = function () {
        if (_.filter($scope.tableData.items, 'selected').length === $scope.tableData.items.length) {
            return true;
        }
        return false;
    };

    /**
     * @ngdoc
     *
     * @name RecordTableController#checkAllSelected
     *
     * @returns undefined
     *
     * @description
     *
     * Method is used to check if all the items are currently selected. If so it will set the `allSelected`
     * flag to true.
     *
     * {@note info Emits an event
     * This method emits the `RECORDTABLE.selection.changed` event when called. In our case this means
     * that whenever the selection is changed the method will be called.}
     */
    this.checkAllSelected = function () {
        if (this.isAllSelected()) {
            if (this.allSelected !== true) {
                this.allSelected = true;
            }
        } else {
            if (this.allSelected === true) {
                this.allSelected = false;
            }
        }

        $scope.$emit('RECORDTABLE.selection.changed', this.getSelectedItems());
    };

    //TODO: Rename this? As it also unselects the naming might be confusing.
    /**
     * @ngdoc method
     *
     * @name RecordTableController#selectAll
     *
     * @returns undefined
     *
     * @description
     *
     * Selects all the elements in the table. If all elements are selected it will unselect them.
     *
     * * {@note info Emits an event
     * This method emits the `RECORDTABLE.selection.changed` event when called. }
     */
    this.selectAll = function () {
        if (!this.isAllSelected()) {
            this.allSelected = true;
        } else {
            this.allSelected = false;
        }

        angular.forEach($scope.tableData.items, function (item) {
            item.selected = this.allSelected;
        }, this);

        $scope.$emit('RECORDTABLE.selection.changed', this.getSelectedItems());
    };

    /**
     * @ngdoc method
     *
     * @name RecordTableController#selectAll
     *
     * @returns {Array}
     *
     * @description
     *
     * Returns an array of all the data columns.
     * This array contains all the column objects except the checkbox column used for selecting.
     */
    this.getRowDataColumns = function () {
        return _.filter($scope.tableConfig.columns, function (column) {
            return !column.checkbox;
        });
    };

    /**
     * @ngdoc method
     *
     * @name RecordTableController#getItems
     *
     * @returns {Array} Array of objects with the items currently in the table.
     *
     * @description
     *
     *
     */
    this.getItems = function () {
        return $scope.tableData.items;
    };

    /**
     * @ngdoc method
     *
     * @name RecordTableController#getSelectedItems
     *
     * @returns {Array} Array of objects that are currently selected
     *
     * @description
     *
     * Returns the items that are marked as selected
     */
    this.getSelectedItems = function () {
        return _.filter(this.getItems(), 'selected');
    };

    /**
     * @ngdoc method
     * @name RecordTableController#processMetaData
     *
     * @description
     *
     * Method that calls all the meta data processing for the record table
     * Currently this sets up the pager for the data table.
     */
    this.processMetaData = function () {
        this.setUpPager();
    };

    /**
     * @ngdoc
     * @name RecordTableController#setUpPager
     *
     * @description
     *
     * Sets pager data onto the this.pager
     *
     * Additionally it updates the this.pager.currentPage to the current page.
     */
    this.setUpPager = function () {
        if (!this.pager.itemsPerPage) {
            this.pager.itemsPerPage = $scope.tableData.items.length;
        }

        this.pager.pageCount = $scope.meta.pager.pageCount;
        this.pager.resultTotal = $scope.meta.pager.total;
        this.pager.currentPage = $scope.meta.pager.page;
    };

    /**
     * @ngdoc
     * @name RecordTableController#getCurrentPageParams
     *
     * @returns {Number|undefined}
     *
     * @description
     *
     * Return the currentpage number or undefined when no page number is available.
     */
    this.getCurrentPageParams = function () {
        if (this.pager.currentPage > 1) {
            return this.pager.currentPage;
        }
    };

    /**
     * @ngdoc
     * @name RecordTableController#switchPage
     *
     * @description
     *
     * Method to call when switching a page. It will call the {Link: RecordTableController#requestNewDataFromService} method.
     */
    this.switchPage = function () {
        if (this.localData === true) {
            if (!angular.isNumber($scope.pageItems) || !angular.isNumber(this.pager.currentPage)) { return; }

            $scope.tableData.items = this.origData.slice(
                $scope.pageItems * (this.pager.currentPage - 1),
                $scope.pageItems * this.pager.currentPage
            );
        } else {
            this.requestNewDataFromService();
        }
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
        var columns = angular.copy($scope.tableConfig.columns);
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

        $scope.tableConfig.columns = columns;
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
        return _.filter($scope.tableConfig.columns || [], 'searchable');
    };

    /**
     * @ngdoc
     * @name RecordTableController#getFilterObject
     * @returns {Object|False}
     *
     * @description
     *
     * Returns an object with the filters that are set. For example:
     * <pre><code>
     *     {
     *       "name": "ANC"
     *     }
     * </code></pre>
     *
     * When no filters are set it will return false.
     */
    this.getFilterObject = function () {
        var filters = this.getColumnsWithFilters(),
            filterObject = {};

        if (filters.length === 0) { return false; }

        angular.forEach(filters, function (column) {
            filterObject[column.name] = column.filter;
        });

        return filterObject;
    };

    /**
     * @ngdoc
     * @name RecordTableController#getRemoteFilters
     *
     * @returns {Array|False} Returns an array of filter strings or false if no filters are set.
     *
     * @description
     *
     * The method takes the filters that are returned from {Link: RecordTableController#getRemoteFilters}
     * and puts them in a format used for the dhis2 web api.
     *
     * Example:
     * <pre><code>
     *     //This filter structure
     *     {
     *      "name": "ANC"
     *     }
     *
     *     //Would be translated to
     *     ["name:like:ANC"]
     * </code></pre>
     */
    this.getRemoteFilters = function () {
        var filters = [];

        if (!this.getFilterObject()) { return; }

        angular.forEach(this.getFilterObject(), function (filterValue, filterOn) {
            if (filterValue) {
                filters.push(filterOn + ':like:' + filterValue);
            }
        });

        return filters.length > 0 ? filters : undefined;
    };

    /**
     * @ngdoc
     * @name RecordTableController#getRemoteParams
     *
     * @returns {{}} An object with remote parameters.
     *
     * @description
     *
     * Returns an object with remote parameters. Currently this object will contain
     * a `filter` and/or a `page` properties.
     *
     */
    this.getRemoteParams = function () {
        var remoteParams = {},
            remoteFilters = this.getRemoteFilters(),
            pagerParam = this.getCurrentPageParams();

        if (remoteFilters) {
            remoteParams.filter = remoteFilters;
        }

        if (pagerParam) {
            remoteParams.page = pagerParam;
        }
        return remoteParams;
    };

    /**
     * @ngdoc
     * @name RecordTableController#requestNewDataFromService
     *
     * @description
     *
     * It calls the {Link: RecordTableController#requestNewDataFromService} and asks the
     * the api service for a new dataset for the table.
     */
    this.requestNewDataFromService = function () {
        var remoteParams = this.getRemoteParams();

        $q.when($scope.d2Service.getList(remoteParams)).then(this.processData.bind(this));
    };

    /**
     * @ngdoc
     * @name RecordTableController#doLocalFiltering
     *
     * @description
     *
     * Filter the `$scope.tableData.items` items by the filters that are set.
     *
     * Note: Local data
     * This will be used for local data.
     */
    this.doLocalFiltering = function () {
        if (this.getFilterObject()) {
            $scope.tableData.items = $filter('filter')(this.origData, this.getFilterObject());
        }
    };

    /**
     * @ngdoc
     * @name RecordTableController#doLocalSorting
     *
     * @description
     *
     * Sort the local data in `$scope.tableData.items` based on the sorting set on the columns.
     *
     * Note: Local data
     * This will be used for local data.
     */
    this.doLocalSorting = function () {
        var sorting = _.filter($scope.tableConfig.columns, 'sort'),
            sortBy = _.pluck(sorting, 'name'),
            items;

        //Don't do anything when there is no sorting to be done
        if (sorting.length === 0) { return; }

        items = _.sortBy($scope.tableData.items, sortBy);
        if (sorting[0] && sorting[0].sort === 'desc') {
            items = items.reverse();
        }

        $scope.tableData.items = items;
    };

    /**
     * TODO: Api sorting is coming to 2.17 so we cannot test this yet
     * @see https://blueprints.launchpad.net/dhis2/+spec/webapi-ordering-of-properties
     */
    this.serviceSorting = function () {
        var sorting = _.filter($scope.tableConfig.columns, 'sort');

        //Don't do anything when there is no sorting to be done
        if (sorting.length === 0) { return; }

        window.alert('API Sorting not yet implemented');
    };

    this.getValuesForColumn = function (column) {
        if (!column || !column.name || !angular.isString(column.name)) {
            return [];
        }

        return _.map($scope.tableData.items, function (item) {
            return item[column.name];
        });
    };

    $scope.$on('RECORDTABLE.selection.clear', function () {
        _.each($scope.tableData.items, function (item) {
            item.selected = false;
        });
        self.allSelected = false;
    });

    $scope.$watch('tableConfig.columns', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            if (self.localData) {
                self.doLocalFiltering();
                self.doLocalSorting();
                self.checkAllSelected();
            }
            if ($scope.d2Service) {
                if (!requestServiceTimeoutIsSet) {
                    $timeout(function () {
                        self.requestNewDataFromService();
                        requestServiceTimeoutIsSet = false;
                    }, 300);
                    requestServiceTimeoutIsSet = true;
                }
            }
        }
    }, true);

    $scope.$watch(function () {
        return self.pager.currentPage || undefined;
    }, function (newVal, oldVal) {
        if (oldVal && newVal !== oldVal) {
            self.switchPage();
        }
    });

    $scope.$watch('tableDataSource', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.parseTableData();
        }
    });
}

angular.module('d2-recordtable').controller('RecordTableController', RecordTableController);
