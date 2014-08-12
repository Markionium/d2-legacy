"use strict";
/*
 * Copyright (c) 2004-2014, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the HISP project nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
(function (angular, undefined) {
    //TODO Write tests for this.
var d2,
    d2Rest,
    d2Auth,
    d2Services,
    d2Filters,
    d2RecordTable,
    d2BreadCrumbs,
    d2IntroList,
    d2HeaderBar,
    d2Directives,
    d2Translate,
    d2ContextMenu,
    d2DetailsBox,
    d2Config;

d2 = {
    scriptPath: (function () {
        var d2ScriptPath;

        return function () {
            var scripts,
                currentScriptPath,
                d2ScriptTag;

            if (d2ScriptPath) {
                return d2ScriptPath;
            }

            d2ScriptTag = angular.element('<script src=""></script>');

            scripts = document.getElementsByTagName('script');

            angular.forEach(scripts, function (script) {
                if (/d2(\.min)?\.js$/i.test(script.src)) {
                    d2ScriptTag = script;
                }
            });

            currentScriptPath = d2ScriptTag.src || '';
            d2ScriptPath = currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);
            return d2ScriptPath;
        }
    })()
};

d2Config = angular.module('d2-config', []);
d2Rest = angular.module('d2-rest', ['restangular']);
d2Auth = angular.module('d2-auth', ['d2-rest']);
d2Translate = angular.module('d2-translate', ['pascalprecht.translate', 'd2-config']);

d2ContextMenu = angular.module('d2-contextmenu', []);
d2DetailsBox =  angular.module('d2-detailsbox', []);

/**
 * @ngdoc module
 * @name d2-typeahead
 *
 * @description
 *
 * #d2-typeahead
 *
 * The typeahead module provides a service that can be used to store typeahead values that can be used
 * by angular ui's typeahead functionality.
 */
var d2TypeAhead = angular.module('d2-typeahead', []);

/**
 * @ngdoc module
 * @name d2-recordtable
 *
 * @requires d2-filters, d2-typeahead, ui.bootstrap.tpls, ui.bootstrap.pagination
 *
 * @description
 *
 * # d2-recordtable
 *
 * The recordtable module contains the directives that are used to show a table that shows data.
 * This table is configurable and can use both local and remote data sources as a base for the data.
 *
 * The recordtable can be sortable and searchable. (Typeahead functionality is available when angular-ui
 * is present.
 *
 * The recordtable will use the paging that is set in the config or use the rest paging as provided by the
 * dhis2 rest services.
 */
d2RecordTable = angular.module('d2-recordtable', [
    'd2-filters',
    'd2-typeahead',
    'ui.bootstrap.tpls',
    'ui.bootstrap.pagination'
]);

/**
 * @ngdoc module
 * @name d2-breadcrumbs
 *
 *
 * @description
 *
 * # d2-breadcrumbs
 *
 * This module contains the component that handles the breadcrumbs in apps
 * The breadcrumbs component contains of a service and a directive.
 * The service will manage the list of breadcrumbs where the directive will display them.
 */
d2BreadCrumbs = angular.module('d2-breadcrumbs', []);

/**
 * @ngdoc module
 * @name d2-introlist
 *
 *
 * @description
 *
 * # d2-introlist
 *
 * The introlist is a menu directive that shows menu items with a small descriptive text and an icon.
 *
 */
d2IntroList = angular.module('d2-introlist', []);

/**
 * @ngdoc module
 * @name d2-headerbar
 *
 *
 * @description
 *
 * # d2-headerbar
 *
 * This module contains the directive for the headerbar
 * the headerbar does not have any services therefore this is the only
 * directive currently in this module.
 */
d2HeaderBar = angular.module('d2-headerbar', []);

//TODO: Filters has a too general name maybe?
/**
 * @ngdoc module
 * @name d2-filters
 *
 * @description
 *
 * This module contains the basic filters that are supported in D2JS. A lot of these filters are general filters and
 * they are used by the components in the library.
 */
d2Filters = angular.module('d2-filters', []);

// Combine modules into a wrapper directive for easy inclusion
// TODO: look at if this is useful or not
angular.module('d2-directives', ['d2-breadcrumbs', 'd2-introlist', 'd2-headerbar', 'd2-recordtable', 'd2-detailsbox']);
d2Services = angular.module('d2-services', ['d2-auth']);

// Create the final d2 module that can be used when all functionality is required
angular.module('d2', ['d2-services', 'd2-directives', 'd2-filters']);

"use strict";

d2Auth.service('currentUser', ["d2Api", function (d2Api) {
    var self = this,
        permissionPromise,
        permissions;

    this.userLoaded = false;
    this.permissionsLoaded = false;

    this.getPermissions = function () {
        return permissionPromise;
    };

    this.hasPermission = function (permissionToCheck) {
        return permissions.indexOf(permissionToCheck) > 0 ? true : false;
    };

    d2Api.currentUser.get().then(function (response) {
        angular.extend(self, response.getDataOnly());
    });

    permissionPromise = d2Api.currentUser.permissions.getList().then(function (response) {
        self.permissionsLoaded = true;
        permissions = response.getDataOnly();
        return permissions;
    });
}]);

/**
 * @ngdoc directive
 * @name breadCrumbs
 *
 * @requires breadCrumbsService
 *
 * @restrict E
 * @scope
 *
 * @param {Object} crumbsList A instance of {@link breadCrumbsService}
 *
 * @description
 *
 * Directive to show a list of breadcrumbs at the place where the directive is inserted.
 * The breadcrumbs crumbs can be modified by using the {@link breadCrumbsService}
 */
d2BreadCrumbs.directive('breadCrumbs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            homeCrumb: "="
        },
        templateUrl: d2.scriptPath() + 'common/breadcrumbs/breadcrumbs.html',
        controller: ["$scope", "$location", "breadCrumbsService", function ($scope, $location, breadCrumbsService) {
            $scope.crumbClick = function (crumb) {
                breadCrumbsService.resetCrumbs(crumb.id);

                if (crumb.click) {
                    crumb.click(angular.copy(crumb));
                }
            };

            $scope.$watchCollection(function () {
                return breadCrumbsService.getCrumbsList();
            }, function (newValue) {
                $scope.crumbsList = newValue;
            });
        }]
    };
});

/**
 * @ngdoc service
 * @name breadCrumbsService
 *
 * @description
 *
 * Service that manages the breadcrumbs list. Use this service throughout your app to
 * modify the breadcrumbs list.
 */
d2BreadCrumbs.service('breadCrumbsService', function () {
    var homeCrumb = [];
    /**
     * @ngdoc property
     * @name breadCrumbsService#crumbsList
     *
     * @kind array
     *
     * @description
     *
     * The array that holds the crumbs list and that can be used to in the crumbs directive.
     * This contains objects that represent the various crumbs. A crumb has the following format.
     *
     * <pre class="prettyprint">
     *  <code class="language-js">{
         *       //Name of the breadcrumb
         *       name: "CrumbName",
         *
         *       // Id of the breadcrumb, this is calculated based on the length of the array
         *       id: 0,
         *
         *       // When a callback is provided when the crumb is added the click function
         *       // set to be used when the crumb is clicked.
         *       click: function () {}
         * }</code>
     * </pre>
     */
    this.crumbsList = [];

    /**
     * @ngdoc method
     * @name breadCrumbsService#addCrumb
     *
     * @param {string} name Name of the breadcrumb
     * @param {function=} callback Callback that should be called when the breadcrumb is clicked
     *
     * @description
     *
     * Adds a breadcrumb to the list of breadcrumbs. It will add a object to the crumbList property list.
     * This object will be in the format as described there. When no callback is given, the click function will be undefined.
     */
    this.addCrumb = function (name, callback) {
        var crumb = {};

        if ( ! angular.isString(name) || name === '') {
            return;
        }

        crumb.name = name;
        crumb.id = this.crumbsList.length;

        if (callback && angular.isFunction(callback)) {
            crumb.click = function () {
                return callback();
            };
        }
        this.crumbsList.push(crumb);
    };

    /**
     * @ngdoc method
     * @name breadCrumbsService#resetCrumbs
     *
     * @param {number=} id
     *
     * @description
     *
     * Resets the crumb list when an id is passed it keeps the crumbs before that point
     */
    this.resetCrumbs = function (id) {
        if (id === undefined) {
            this.crumbsList = [];
        }

        this.crumbsList = _.filter(this.crumbsList, function (crumb) {
            return crumb.id <= id;
        });
    };

    /**
     * @ngdoc method
     * @name breadCrumbsService#getCrumbsList
     *
     * @returns {Array}
     *
     * @description
     *
     * Return the current crumbs list
     */
    this.getCrumbsList = function () {
        return homeCrumb.concat(this.crumbsList);
    };

    /**
     * @ndgoc method
     * @name breadCrumbService#homeCrumb
     *
     * @param {String} crumbName The name of the home crumb to be displayed
     * @param {Function=} [clickCallback] Click function that should be called when the homeCrumb is clickec
     *
     * @returns {Object} returns the homecrumb object
     *
     * @description
     *
     * Allows you to add a root crumb that will always be the first one.
     */
    this.addHomeCrumb = function (crumbName, clickCallback) {
        var self = this;

        homeCrumb = [];
        homeCrumb.push({
            name: crumbName,
            click:  function () {
                self.crumbsList = [];
                if (angular.isFunction(clickCallback)) {
                    clickCallback();
                }
            }
        });
        return homeCrumb[0];
    }
});

d2Config.constant('API_ENDPOINT', '/dhis/api');
d2Config.factory('apiConfig', ["API_ENDPOINT", function (API_ENDPOINT) {
    return {
        getUrl: function (resource) {
            if ( ! angular.isString(resource)) {
                throw 'Api Config Error: Resource URL should be a string';
            }
            if (resource[0] === '/') {
                resource = resource.substr(1);
            }
            return [API_ENDPOINT, resource].join('/');
        }
    }
}]);

d2ContextMenu.directive('contextMenu', function () {

});
/**
 * @ngdoc directive
 * @name detailsBox
 *
 * @restrict EA
 * @scope
 *
 * @param {Object} details The simple object with key/value pays of items that you want shown.
 * The keys (property names) will become the headers and the values for those will become the content.
 * @param {Array=} headers This will have a list of the items that should be shown.
 *
 * @describe
 *
 * Displays a list of details that are passed in as an object. It will create a div for each of the properties.
 * Each of these will get a `header` and a `content` field.
 */
d2DetailsBox.directive('detailsBox', function () {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            details: "=",
            headers: "="
        },
        templateUrl: d2.scriptPath() + 'common/detailsbox/detailsbox.html',
        controller: ["$scope", function ($scope) {
            var self = this;

            this.parseDetailsToArray = function () {
                var filteredList = $scope.details;

                if (angular.isArray($scope.headers) && $scope.headers.length > 0) {
                    filteredList = _.pick($scope.details, $scope.headers);
                }

                $scope.valueList = _.map(filteredList, function (value, key) {
                    return {
                        "key": key,
                        "value": value
                    };
                });
            };

            this.parseDetailsToArray();

            $scope.$watch('details', function (newVal, oldVal) {
                if (newVal === oldVal) return;
                self.parseDetailsToArray();
            });
        }]
    };
});

d2Filters.filter('capitalize', function () {
    return function (input) {
        if (angular.isString(input)) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
        return input;
    };
});

/**
 * @ngdoc filter
 * @name translate
 *
 * @description
 *
 * This filter is a place holder for the `translate` filter that we support. This empty filter is provided because of the way how filters work in AngularJS.
 *
 * This filter will not do anything
 *
 * {@note warning This does NOT translate.
 *  Because this is a placeholder filter it only capitalizes given strings.
 *  To add translation functionality add the `d2-translate` module to your app.
 * }
 */
d2Filters.filter('translate', ["capitalizeFilter", function (capitalizeFilter) {
    return function (input) {
        return capitalizeFilter(input);
    };
}]);

/**
 * @ngdoc directive
 * @name headerBar
 *
 * @restrict E
 * @scope
 *
 * @description
 *
 * This directive represents the headerbar in dhis
 *
 * @example
 *
 * <d2-header-bar></d2-header-bar>
 */
d2HeaderBar.directive('headerBar', function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@',
            link: '@',
            logo: '@',
            hasContent: '@'
        },
        templateUrl: d2.scriptPath() + 'common/headerbar/headerbar.html',
        compile: function (element, attrs) {
            attrs.title = attrs.title || 'District Health Information Software 2';
            attrs.link = attrs.link || '../dhis-web-dashboard-integration/index.action';
            attrs.logo = attrs.logo || '../dhis-web-commons/css/light_blue/logo_banner.png';
        }
    };
});

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
d2IntroList.directive('introList', function () {
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

/**
 * @ngdoc controller
 * @name RecordTableController
 *
 * @description
 *
 * TODO: Document the rest of this Controller.
 */
d2RecordTable.controller('RecordTableController', ["$scope", "$q", "$filter", "$timeout", "typeAheadService", function ($scope, $q, $filter, $timeout, typeAheadService) {
    var self = this,
        requestServiceTimeoutIsSet = false;

    this.localData = true;

    this.origData = [];
    this.typeAheadCache = typeAheadService;

    $scope.items = [];
    $scope.pager = {};

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
        $scope.rowClick = tableConfig.rowClick;

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
        if (angular.isArray($scope.tableData) && $scope.tableData.getList !== undefined) {
            this.localData = false;
            $scope.d2Service = $scope.tableData;
            promise = $scope.d2Service.getList(this.getRemoteParams());
        } else {
            promise = $scope.tableData;
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
        $scope.items = this.origData = data;
        $scope.columns = $scope.columns || this.getHeadersFromData();

        if ($scope.pageItems) {
            $scope.items = $scope.items.slice(0, $scope.pageItems);
        }
        if (data && data.meta) {
            $scope.meta = data.meta;
            this.processMetaData();
        }

        angular.forEach($scope.columns, function (column) {
            self.typeAheadCache.add(column.name, self.getValuesForColumn(column));
        });

        return this;
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
     * Sets pager data onto the $scope.pager
     *
     * Additionally it updates the $scope.pager.currentPage to the current page.
     */
    this.setUpPager = function () {
        if ( ! $scope.pager.itemsPerPage) {
            $scope.pager.itemsPerPage = $scope.items.length;
        }

        $scope.pager.pageCount = $scope.meta.pager.pageCount;
        $scope.pager.resultTotal = $scope.meta.pager.total;
        $scope.pager.currentPage = $scope.meta.pager.page;
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
        if ($scope.pager.currentPage > 1) {
            return $scope.pager.currentPage;
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
        this.requestNewDataFromService();
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

        if (filters.length === 0) return false;

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

        if (!this.getFilterObject()) return;
        angular.forEach(this.getFilterObject(), function (filterValue, filterOn) {
            if (filterValue) {
                filters.push(filterOn + ":like:" + filterValue);
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
     * Filter the `$scope.items` items by the filters that are set.
     *
     * Note: Local data
     * This will be used for local data.
     */
    this.doLocalFiltering = function () {
        if (this.getFilterObject()) {
            $scope.items = $filter('filter')(this.origData, this.getFilterObject());
        }
    };

    /**
     * @ngdoc
     * @name RecordTableController#doLocalSorting
     *
     * @description
     *
     * Sort the local data in `$scope.items` based on the sorting set on the columns.
     *
     * Note: Local data
     * This will be used for local data.
     */
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

        return _.map($scope.items, function (item) {
            return item[column.name];
        });
    };

    $scope.$watch('columns', function (newValue, oldValue) {
        if (oldValue !== newValue) {
            if (self.localData) {
                self.doLocalFiltering();
                self.doLocalSorting();
            }
            if ($scope.d2Service) {
                if ( ! requestServiceTimeoutIsSet) {
                    $timeout(function () {
                        self.requestNewDataFromService();
                        requestServiceTimeoutIsSet = false;
                    }, 300);
                    requestServiceTimeoutIsSet = true;
                }
            }
        }
    }, true);

    $scope.$watch('pager.currentPage', function (newVal, oldVal) {
        if (oldVal && newVal !== oldVal) {
            self.switchPage();
        }
    });

    $scope.$watch('tableData', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.parseTableData();
        }
    })
}]);

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

var recordTable = angular.module('d2-recordtable');

/**
 * @ngdoc directive
 * @name recordTableHeader
 *
 * @restrict AC
 * @scope
 *
 * @requires recordTable
 *
 * @description
 *
 * This directive represents the column headers as they are displayed by the {@link recordTable} directive.
 *
 * The directive adds the sort functionality and calls the setSortOrder function on {@link RecordTableController}.
 *
 * An input box with be added to the column header when `column.searchable` is set to true.
 *
 * When typeahead is available it asks for the typeahead values on {@link RecordTableController} through the `typeAheadCache` property.
 *
 */
d2RecordTable.directive('recordTableHeader', function () {
    return {
        restrict: 'AC',
        replace: true,
        require: '^recordTable',
        transclude: true,
        scope: {
            column: '='
        },
        template: '<th class="table-header"><a ng-click="sortOrder()" href="#" ng-if="column.sortable" ng-transclude ng-class="\'sorting-\' + column.sort" translate></a><span ng-if="!column.sortable" ng-transclude></span><input ng-if="column.searchable" ng-model="column.filter" type="text" typeahead="name for name in getTypeAheadFor(column) | filter:$viewValue | limitTo:8"></th>',
        link: function (scope, element, attr, parentCtrl) {
            scope.sortOrder = function (event) {
                parentCtrl.setSortOrder(scope.column);
            }

            scope.getTypeAheadFor = function (column) {
                return parentCtrl.typeAheadCache[column.name];
            }
        }
    };
});



"use strict";
    d2Rest.provider('d2Api', ["RestangularProvider", function (RestangularProvider) {

        /*****************************************************************************
         * Provided Object definition
         */

        /**
         * Extend Restangular with a set of predefined endpoints
         * This allows us to still have all the restangular functionality
         * available on our own api. But the predefined endpoints make it
         * more easy for you to use the DHIS2 api.
         *
         * @constructor
         */
        var D2ApiRest = function () {
            this.indicators = this.all('indicators');
            this.currentUser = this.one('me');
            this.currentUser.permissions = this.one('me').all('authorization');
            this.schemas = this.all('schemas');

            /**
             * Add a endpoint to the rest service
             * @param {string} endPointName The name of this endpoint
             * @param {boolean=} isObject If the result is a single object
             *
             */
            this.addEndPoint = function (endPointName, isObject) {

                //Remove the first character if it's a /
                if (endPointName.match(/^\//)) {
                    throw 'D2Api Error: EndPoint should not have a leading slash';
                }

                if (this[endPointName]) {
                    throw 'D2Api Error: EndPoint "' + endPointName + '" already exists';
                }

                if (isObject) {
                    this[endPointName] = this.one(endPointName);
                } else {
                    this[endPointName] = this.all(endPointName);
                }

                return this[endPointName];
            };

            this.getEndPoint = function (endPointName) {
                if (this[endPointName] === undefined) {
                    throw 'D2Api Error: Endpoint does not exist';
                }
                return this[endPointName];
            };

            this.hasEndPoint = function (endPointName) {
                if (this[endPointName]) {
                    return true;
                }
                return false;
            };
        };

        /*****************************************************************************
         * Provider methods
         */

        /**
         * Set a base url to be used with the api.
         *
         * @param baseUrl=
         */
        this.setBaseUrl = function (baseUrl) {
            this.config.setBaseUrl(baseUrl);
        };

        this.$get = ["Restangular", function (Restangular) {
            var api;

            api  = D2ApiRest;
            api.prototype = Restangular;

            return new D2ApiRest();
        }];

        /**
         * Expose the restangularProvider so settings can be set that we didn't expose
         * through shorthand methods
         *
         * @type {Object} RestangularProvider instance
         */
        this.config = RestangularProvider;

        /*****************************************************************************
         * Do some extra default configuration specific to our (DHIS2) Api
         */

        /**
         * Response interceptor that takes the data from the endpoint and extracts the meta
         * data that is wrapped around it.
         */
        this.config.addResponseInterceptor(function (data, operation, what, url, response, defered) {
            if (operation === 'getList' && data && data[what]) {
                var newData = data[what],
                    metaData = angular.copy(data);

                delete metaData[what];
                newData.meta = metaData;

                return newData;
            }
            return data;
        });

        /**
         * Add a method to get the original non restangularized data to the
         * This can be used for when only one wants to use the data only.
         */
        this.config.setResponseExtractor(function(response) {
            var newResponse = response,
                dataOnly = angular.copy(response);

            newResponse.getDataOnly = function () {
                return dataOnly;
            };

            return newResponse;
        });

        this.config.setOnElemRestangularized(function (element, isCollection, what, Restangular) {
            if (isCollection || element.getDataOnly) {
                return element;
            }

            //TODO: In chrome canary we cannot extend strings (30-Jul-2014)?
            if (angular.isString(element) ) {
                return element;
            }

            element.getDataOnly = function () {
                var result = angular.copy(element);
                result = Restangular.stripRestangular(result);
                delete result.getDataOnly;
                return result;
            };
            return element;
        });
    }]);

    /**
     * Set the default base url
     */
    d2Rest.config(["d2ApiProvider", function (d2ApiProvider) {
        d2ApiProvider.setBaseUrl('/dhis/api');
    }]);

"use strict";
d2Services.factory('schemaProcessor', function () {
    return function (providedSchemas) {
        var schemaProcessor = new function () {
            this.schemas = [];
            this.schemaGroups = {};

            this.getKlassGroupName = function (klass) {
                var parts = klass.split('.');
                return parts[parts.length - 2];
            };

            this.addSchemasToGroups = function (schemas) {
                var self = this,
                    schemaGroups = {};

                angular.forEach(schemas, function (schema) {
                    var groupName = self.getKlassGroupName(schema.klass);
                    if (schemaGroups[groupName] === undefined) {
                        schemaGroups[groupName] = [];
                    }
                    ;
                    schemaGroups[groupName].push(schema);
                });
                this.schemaGroups = schemaGroups;
                return schemaGroups;
            };

            this.filterSchemasByPermissions = function (userPermissions) {
                var self = this,
                    authorizedSchemas = [];

                angular.forEach(this.schemas, function (schema) {
                    if (schema.isAuthorizedBy(userPermissions))
                        authorizedSchemas.push(schema);
                });

                return authorizedSchemas;
            };

            this.process = function (providedSchemas) {
                this.schemas = providedSchemas;

                angular.forEach(this.schemas, function (schema) {
                    schema.getPermissions = function () {
                        var permissions = {
                            all: []
                        };

                        angular.forEach(this.authorities, function (permission) {
                            if (permission.type === 'DELETE') {
                                permissions['remove'] = permission.authorities;
                            } else {
                                permissions[permission.type.toLowerCase()] = permission.authorities;
                            }
                            permissions['all'] = permissions['all'].concat(permission.authorities);

                        });
                        return permissions;
                    };
                    schema.isAuthorizedBy = function (userPermissions) {
                        var authorized = false,
                            permissions = schema.getPermissions();
                        angular.forEach(permissions.all, function (permission) {
                            if (userPermissions.indexOf(permission) >= 0) {
                                schema.permissions = permissions;
                                authorized = true;
                            }
                        });
                        return authorized;
                    }
                });
            };

            this.getSchemaGroupsForPermissions = function (permissions) {
                var authorizedSchemas = this.filterSchemasByPermissions(permissions),
                    schemaGroups = this.addSchemasToGroups(authorizedSchemas);
                return schemaGroups;
            };

            this.filterByGroupNames = function (names) {
                var schemas = this.addSchemasToGroups(this.schemas),
                    filteredSchemaGroups = {};

                angular.forEach(names, function (name) {
                    if (schemas[name])
                        filteredSchemaGroups[name] = schemas[name];
                });

                return filteredSchemaGroups;
            };
        };
        schemaProcessor.process(providedSchemas || []);
        return schemaProcessor;
    };
});

d2Translate.factory('d2LanguageLoader', ["$q", "$http", "translateApi", function ($q, $http, translateApi) {
    var loadedValues = {};

    return function (options, $uses) {
        var deferred = $q.defer();

        if (loadedValues[options.key]) {
            loadedValues[options.key] = angular.extend(translateApi.apiTranslations, loadedValues[options.key]);
            deferred.resolve(angular.extend(translateApi.apiTranslations, loadedValues[options.key]));
        } else {
            $http.get('common/i18n/' + options.key + '.json').success(function (data) {
                loadedValues[options.key] = angular.extend(translateApi.apiTranslations, data);
                deferred.resolve(loadedValues[options.key]);
            }).error(function (data) {
                    deferred.reject(options.key);
                });
        }
        return deferred.promise;
    };
}]);

d2Translate.factory('d2MissingTranslationHandler', ["$translate", "translateApi", function ($translate, translateApi) {
    return function (translationId, $uses) {
        translateApi.add(translationId);
        translateApi.translateThroughApi($uses)
    }
}]);

d2Translate.service('translateApi', ["$q", "$translate", "apiConfig", "$timeout", "$http", function ($q, $translate, apiConfig, $timeout, $http) {
    var self = this;
    var timeOutSet = false;
    var translateKeys = [];

    this.apiTranslations = {};
    this.add = function (translationId) {
        if (angular.isString(translationId) && translationId.trim() !== '') {
            translateKeys.push(translationId.trim());
            translateKeys = _.uniq(translateKeys);
        }
    };

    this.getTranslationKeys = function () {
        var result = translateKeys;
        translateKeys = [];
        return result;
    };

    this.getTranslationsFromApi = function (languageCode) {
        var deferred = $q.defer();

        if (timeOutSet) {
            deferred.reject('waiting');
        }
        timeOutSet = true;
        $timeout(function () {
            var translations = self.getTranslationKeys();
            $http.post(apiConfig.getUrl('i18n'), translations).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            $translate.refresh(languageCode);
            timeOutSet = false;
        }, 100, false);

        return deferred.promise;
    }

    this.translateThroughApi = function (languageCode) {
        if (timeOutSet === false) {
            this.getTranslationsFromApi(languageCode).then(function (data) {
                self.apiTranslations = data;
                $translate.refresh();
            });
        }
    }
}]);

d2Translate.config(["$translateProvider", function ($translateProvider) {
    $translateProvider.useLoader('d2LanguageLoader');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useMissingTranslationHandler('d2MissingTranslationHandler');
}]);
/**
 * @ngdoc service
 * @name typeAheadService
 *
 * @description
 *
 * The typeahead services lets you store and retrieve typeahead values that can be used
 * by angular ui's typeahead functionality.
 *
 * This service was created to easily keep track of typeahead values for REST searchable tables.
 * The typeahead service keeps new names that are added to it.
 *
 * This is used for example in the {@link d2-recordtable#recordTable} directive. When searching fields that are loaded
 * by a rest service. When searching and new values get pulled in these get added to the typeahead service.
 */
d2TypeAhead.service('typeAheadService', function () {
    /**
     * @ngdoc method
     * @name typeAheadService#add
     *
     * @param {String} id The identifier of what typeahead these values belong to.
     * @param {Array=} [values] The values that should be added to the typeahead for the given id.
     *
     * @description
     *
     * Allows you to add values to the typeAheadService. When the method is called with an identifier only
     * it will create an empty values list.
     *
     * Whenever a list for the given identifier already exists it will append the
     * new given values to the already existing list of values.
     *
     * throws {Error} Only string identifiers are allowed
     * throws {Error} Cannot override add or get methods
     * throws {Error} Values should be an array
     */
    this.add = function (id, values) {
        if (!angular.isString(id)) {
            throw 'Only string identifiers are allowed';
        }
        if (id === 'get' || id === 'add') {
            throw 'Cannot override add or get methods';
        }
        if (values !== undefined && !angular.isArray(values)) {
            throw 'Values should be an array';
        }

        this[id] = _.uniq((this[id] || []).concat(values));
    };

    /**
     * @ngdoc method
     * @name typeAheadService#get
     *
     * @param {String} id The identifier of the typeAhead value list to retrieve
     * @returns {Array}
     *
     * @description
     *
     * Returns the values of for the given identifier.
     *
     * {@note When the identifier does not exist
     * And empty list will be returned. }
     */
    this.get = function (id) {
        return this[id] || [];
    };
});

})(angular);
