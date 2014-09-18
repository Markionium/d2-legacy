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
    /* jshint ignore:start */
var d2 = {
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
        };
    })()
};
/* jshint ignore:end */

angular.module('d2-config', []);

/**
 * @ngdoc module
 * @name d2-rest
 *
 * @description
 *
 * #d2-rest
 *
 * The `d2-rest` module is the module we use that contains the code to communicate with the dhis2 webapi.
 * This will provide you with an easy way to retrieve data from the api.
 *
 * It contains a few predefined endpoints that we currently use ourselfs. But it also provides
 * and easy and convenient way to create and resuse your own endpoints.
 */
angular.module('d2-rest', ['restangular']);
angular.module('d2-auth', ['d2-rest']);
angular.module('d2-translate', ['pascalprecht.translate', 'd2-config']);

/**
 * @ngdoc module
 * @name d2-contextmenu
 *
 * @description
 *
 * This module wraps the ng-context-menu dependency.
 */
angular.module('d2-contextmenu', []);

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
angular.module('d2-typeahead', []);

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
angular.module('d2-recordtable', [
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
angular.module('d2-breadcrumbs', []);

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
angular.module('d2-filters', []);

/**
 * @ngdoc module
 * @name d2-detailsbox
 *
 * @description
 *
 * This module represents the detailsbox that shows basic details about a record. This
 * can show a list details in key/value format.
 */
angular.module('d2-detailsbox', []);

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
angular.module('d2-headerbar', []);

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
angular.module('d2-introlist', []);

/**
 * @ngdoc module
 * @name d2-uienhancements
 *
 * @description
 *
 * #d2-uienhancements
 *
 * This module contains a list of useful small enhancements to add to your ui.
 */
angular.module('d2-ui-enhancements', []);

// Combine modules into a wrapper directive for easy inclusion
// TODO: look at if this is useful or not
angular.module('d2-directives', ['d2-breadcrumbs', 'd2-introlist', 'd2-headerbar', 'd2-recordtable', 'd2-detailsbox', 'd2-ui-enhancements', 'd2-contextmenu']);
angular.module('d2-services', ['d2-auth']);

// Create the final d2 module that can be used when all functionality is required
angular.module('d2', ['d2-services', 'd2-directives', 'd2-filters']);

function currentUser(d2Api, $q) {
    var permissions;
    var user;

    function loadPermissions() {
        var permissionPromise = d2Api.currentUser.permissions.getList().then(function (response) {
            permissions = response.getDataOnly();
            return permissions;
        });

        function hasPermission(permissionToCheck) {
            return permissionPromise.then(function (permissions) {
                if (permissions.indexOf(permissionToCheck) > 0) {
                    return true;
                } else {
                    return $q.reject('User does not have this permission');
                }
            });
        }

        permissionPromise.hasPermission = hasPermission;
        return permissionPromise;
    }

    /**
     * Loading of the user profile
     */
    user = d2Api.currentUser.get();

    user = angular.extend(user, {
        valueFor: function (valueKey) {
            if (this[valueKey]) {
                return this[valueKey];
            } else {
                return undefined;
            }
        },
        permissions: loadPermissions()
    });

    user.then(function (response) {
        angular.extend(user, response.getDataOnly());
    });

    return user;
}
currentUser.$inject = ["d2Api", "$q"];

angular.module('d2-auth').factory('currentUser', currentUser);

/* global d2 */
/**
 * @ngdoc controller
 * @name BreadCrumbsController
 *
 * @param {Object} $scope Angular scope object. Isolated scope for this directive
 * @param {Object} breadCrumbsService Breadcrumb service that contains the breadcrumb logic {@link breadCrumbsService}
 *
 * @description
 *
 * Controller for the breadcrumbs directive
 */
function BreadCrumbsController($scope, breadCrumbsService) {
    /**
     * @ngdoc method
     * @name BreadCrumbsController#crumbClick
     *
     * @param {Object} crumb The crumb object corresponding to the crumb that was clicked on.
     *
     * @description
     *
     * Callback for when a bread crumb is clicked on.
     * It removes the breadcrumbs after the one that was clicked on and then calls the crumbs click handler that was
     * specified when creating the crumb.
     */
    this.crumbClick = function (crumb) {
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
}
BreadCrumbsController.$inject = ["$scope", "breadCrumbsService"];

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
 *
 * @example
    <example name="bread-crumbs" module="bread">
        <file name="index.html">
            <div ng-controller="appCtrl">
                <bread-crumbs></bread-crumbs>
            </div>
        </file>
        <file name="appController.js">
            var app = angular.module('bread', ['d2-breadcrumbs'])

            app.controller('appCtrl', function (breadCrumbsService) {
                 breadCrumbsService.addCrumb('Home');
                 breadCrumbsService.addCrumb('Data Indicators', function () {
                     alert('Data Indicators');
                 });
            });
        </file>
        <file name="styles.css">
            .crumb:after {
                content: " > "
            }
        </file>
    </example>
 */
angular.module('d2-breadcrumbs').directive('breadCrumbs', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            homeCrumb: '='
        },
        templateUrl: d2.scriptPath() + 'common/breadcrumbs/breadcrumbs.html',
        controllerAs: 'breadCrumbs',
        controller: BreadCrumbsController
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
function breadCrumbsService() {
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

        if (!angular.isString(name) || name === '') {
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
    };
}

angular.module('d2-breadcrumbs').service('breadCrumbsService', breadCrumbsService);

function apiConfig(API_ENDPOINT) {
    return {
        getUrl: function (resource) {
            if (!angular.isString(resource)) {
                throw 'Api Config Error: Resource URL should be a string';
            }
            if (resource[0] === '/') {
                resource = resource.substr(1);
            }
            return [API_ENDPOINT, resource].join('/');
        }
    };
}
apiConfig.$inject = ["API_ENDPOINT"];

angular.module('d2-config').constant('API_ENDPOINT', '/dhis/api');
angular.module('d2-config').factory('apiConfig', apiConfig);

function contextMenuController($scope) {
    this.contextMenuId = $scope.contextMenuId;
}

function contextMenu($document) {

    $document.on('click', function (event) {
        var menuElement;

        if (!angular.element(event.target).hasClass('context-menu')) {
            window.console.log('wrong element');
        }

        menuElement = angular.element('#' + angular.element(event.target).attr('context-menu'));
        angular.element('.context-menu-dropdown.open').removeClass('open');

        window.console.log('clicked');
        menuElement.addClass('open');
    });

    return {
        restrict: 'A',
        scope: {
            contextMenuId: '@contextMenu'
        },
        controller: contextMenuController,
        link: function (scope, element) {
            element.addClass('context-menu');
        }
    };
}
contextMenu.$inject = ["$document"];

angular.module('d2-contextmenu').directive('contextMenu', contextMenu);

//return {
//    restrict: 'A',
//    scope: {
//        'callback': '&contextMenu',
//        'disabled': '&contextMenuDisabled'
//    },
//    link: function($scope, $element, $attrs) {
//        var opened = false;
//
//        function open(event, menuElement) {
//            menuElement.addClass('open');
//
//            var doc = $document[0].documentElement;
//            var docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
//                docTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0),
//                elementWidth = menuElement[0].scrollWidth,
//                elementHeight = menuElement[0].scrollHeight;
//            var docWidth = doc.clientWidth + docLeft,
//                docHeight = doc.clientHeight + docTop,
//                totalWidth = elementWidth + event.pageX,
//                totalHeight = elementHeight + event.pageY,
//                left = Math.max(event.pageX - docLeft, 0),
//                top = Math.max(event.pageY - docTop, 0);
//
//            if (totalWidth > docWidth) {
//                left = left - (totalWidth - docWidth);
//            }
//
//            if (totalHeight > docHeight) {
//                top = top - (totalHeight - docHeight);
//            }
//
//            menuElement.css('top', top + 'px');
//            menuElement.css('left', left + 'px');
//            opened = true;
//        }
//
//        function close(menuElement) {
//            menuElement.removeClass('open');
//            opened = false;
//        }
//
//        $element.bind('contextmenu', function(event) {
//            if (!$scope.disabled()) {
//                if (ContextMenuService.menuElement !== null) {
//                    close(ContextMenuService.menuElement);
//                }
//                ContextMenuService.menuElement = angular.element(document.getElementById($attrs.target));
//                ContextMenuService.element = event.target;
//                //console.log('set', ContextMenuService.element);
//
//                event.preventDefault();
//                event.stopPropagation();
//                $scope.$apply(function() {
//                    $scope.callback({ $event: event });
//                    open(event, ContextMenuService.menuElement);
//                });
//            }
//        });
//
//        function handleKeyUpEvent(event) {
//            //console.log('keyup');
//            if (!$scope.disabled() && opened && event.keyCode === 27) {
//                $scope.$apply(function() {
//                    close(ContextMenuService.menuElement);
//                });
//            }
//        }
//
//        function handleClickEvent(event) {
//            if (!$scope.disabled() &&
//                opened &&
//                (event.button !== 2 || event.target !== ContextMenuService.element)) {
//                $scope.$apply(function() {
//                    close(ContextMenuService.menuElement);
//                });
//            }
//        }
//
//        $document.bind('keyup', handleKeyUpEvent);
//        // Firefox treats a right-click as a click and a contextmenu event while other browsers
//        // just treat it as a contextmenu event
//        $document.bind('click', handleClickEvent);
//        $document.bind('contextmenu', handleClickEvent);
//
//        $scope.$on('$destroy', function() {
//            //console.log('destroy');
//            $document.unbind('keyup', handleKeyUpEvent);
//            $document.unbind('click', handleClickEvent);
//            $document.unbind('contextmenu', handleClickEvent);
//        });
//    }
//};

/* global d2 */
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
 * @description
 *
 * Displays a list of details that are passed in as an object. It will create a div for each of the properties.
 * Each of these will get a `header` and a `content` field.
 *
 * @example
 This example specifies the most basic usage of the detailsbox. It passes an object and displays it's properties.

 <example module="d2-detailsbox">
 <file name="index.html">
    <div ng-init="details = {
            'name': 'ANC 1st visit',
            'shortName': 'ANC 1st',
            'domainType': 'AGGREGATE',
            'numberType': 'number'
        }">
        <details-box details="details"></details-box>
    </div>
 </file>
 </example>

 @example
 This example specifies a list of headers to be displayed. This will filter the detail object and omit any keys not
 present in the headerList.

 <example module="d2-detailsbox">
 <file name="index.html">
     <div ng-init="details = {
                'name': 'ANC 1st visit',
                'shortName': 'ANC 1st',
                'domainType': 'AGGREGATE',
                'numberType': 'number'
            };
            headerList=['shortName', 'numberType']">
     <details-box details="details" headers="headerList"></details-box>
     </div>
 </file>
 </example>
 */
function detailsBox() {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            details: '=',
            headers: '='
        },
        templateUrl: d2.scriptPath() + 'common/detailsbox/detailsbox.html',
        controller: function ($scope) {
            var self = this;

            this.parseDetailsToArray = function () {
                var filteredList = $scope.details;

                if (angular.isArray($scope.headers) && $scope.headers.length > 0) {
                    filteredList = _.pick($scope.details, $scope.headers);
                }

                $scope.valueList = _.map(filteredList, function (value, key) {
                    return {
                        key: key,
                        value: value
                    };
                });
            };

            this.parseDetailsToArray();

            $scope.$watch('details', function (newVal, oldVal) {
                if (newVal === oldVal) { return; }
                self.parseDetailsToArray();
            });
        }
    };
}

angular.module('d2-detailsbox').directive('detailsBox', detailsBox);

/**
 * @ngdoc filter
 * @name capitalize
 *
 * @description
 *
 * Capitalizes the first letter of the given string.
 */
function capitalize() {
    return function (input) {
        if (angular.isString(input)) {
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
        return input;
    };
}

angular.module('d2-filters').filter('capitalize', capitalize);


/**
 * @ngdoc filter
 * @name translate
 *
 * @requires d2-filters#capitalize
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
function translate(capitalizeFilter) {
    return function (input) {
        return capitalizeFilter(input);
    };
}
translate.$inject = ["capitalizeFilter"];

angular.module('d2-filters').filter('translate', translate);

/* global d2 */
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
 This example specifies the most basic usage of the detailsbox. It passes an object and displays it's properties.

 <example module="d2-headerbar">
 <file name="index.html">
    <header-bar logo="https://www.dhis2.org/sites/all/themes/dhis/logo.png"></header-bar>
 </file>
 </example>
 */
function headerBar() {
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
}

angular.module('d2-headerbar').directive('headerBar', headerBar);

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
function introList() {
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
}

angular.module('d2-introlist').directive('introList', introList);

/**
 * @ngdoc controller
 * @name RecordTableController
 *
 * @description
 *
 * TODO: Document the rest of this Controller.
 */
function RecordTableController($scope, $q, $filter, $timeout, typeAheadService) {
    var self = this,
        requestServiceTimeoutIsSet = false;

    this.localData = true;

    this.origData = [];
    this.typeAheadCache = typeAheadService;

    $scope.items = [];
    this.pager = {};
    this.contextMenu = $scope.contextMenu;

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

        if (this.isSelectable()) {
            this.addSelectable();
        }

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

        if (data && this.localData) {
            this.pager = {
                currentPage: 1,
                resultTotal: data.length,
                itemsPerPage: $scope.pageItems
            };
        }

        return this;
    };

    this.isSelectable = function () {
        if (angular.isDefined($scope.tableConfig) && $scope.tableConfig.select === true) {
            return true;
        }
        return false;
    };

    this.addSelectable = function () {
        $scope.columns = [{
            name: '',
            checkbox: true
        }].concat($scope.columns);

        _.each($scope.items, function (item) {
            item.selected = false;
        });
    };

    this.selectAll = function () {
        return function () {
            _.each($scope.items, function (item) {
                item.selected = true;
            });
        };
    };

    this.getRowDataColumns = function () {
        return _.filter($scope.columns, function (column) {
            return !column.checkbox;
        });
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
            this.pager.itemsPerPage = $scope.items.length;
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

            $scope.items = this.origData.slice(
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
        if (sorting.length === 0) { return; }

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
        var sorting = _.filter($scope.columns, 'sort');

        //Don't do anything when there is no sorting to be done
        if (sorting.length === 0) { return; }

        window.alert('API Sorting not yet implemented');
    };

    this.getValuesForColumn = function (column) {
        if (!column || !column.name || !angular.isString(column.name)) {
            return [];
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

    $scope.$watch('tableData', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            self.parseTableData();
        }
    });
}
RecordTableController.$inject = ["$scope", "$q", "$filter", "$timeout", "typeAheadService"];

angular.module('d2-recordtable').controller('RecordTableController', RecordTableController);

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
            tableData: '=',
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
 * #Sorting
 *
 * The directive adds the sort functionality and calls the setSortOrder function on {@link RecordTableController}.
 *
 * #Searchable columns
 * An input box with be added to the column header when `column.searchable` is set to true.
 *
 * A class can be configured in the tableConfig that is passed to the recordTable directive to add a class to the input boxes.
 * When adding a property `headerInputClass` to the tableConfig this class will be added to the input searchboxes.
 *
 * #Typeahead
 * When typeahead is available it asks for the typeahead values on {@link RecordTableController} through the `typeAheadCache` property.
 */
function recordTableHeader() {
    return {
        restrict: 'AC',
        replace: true,
        require: '^recordTable',
        transclude: true,
        scope: {
            column: '=',
            config: '='
        },

        template: [
            '<th class="table-header">',
            '<a ng-if="column.sortable && !column.checkbox" ng-click="sortOrder()" href="#" ng-transclude ng-class="\'sorting-\' + column.sort" translate></a>',
            '<span ng-if="!column.sortable && !column.checkbox" ng-transclude></span>',
            '<input ng-if="column.searchable && !column.checkbox" ng-model="column.filter" type="text" ng-class="config.headerInputClass"' +
                ' typeahead="name for name in getTypeAheadFor(column) | filter:$viewValue | limitTo:8">',
            '<record-table-selectable ng-if="column.checkbox"></record-table-selectable>',
            '</th>'
        ].join(''),

        link: function (scope, element, attr, parentCtrl) {
            scope.sortOrder = function () {
                parentCtrl.setSortOrder(scope.column);
            };

            scope.getTypeAheadFor = function (column) {
                return parentCtrl.typeAheadCache[column.name];
            };
        }
    };
}

angular.module('d2-recordtable').directive('recordTableHeader', recordTableHeader);

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
recordTableSelectable.$inject = ["$parse"];

angular.module('d2-recordtable').directive('recordTableSelectable', recordTableSelectable);

/**
 * @ngdoc provider
 * @name d2ApiProvider
 *
 * @description
 *
 * This is the d2Api "provider" that can be used to configure the d2Api. The provider will expose
 * the restangularProvider through the `config` property.
 *
 * When the provider is called by angular it will do some default configuration specific for the
 * dhis2 api. This should make it more convenient for you to use the d2Api to get data from the
 * dhis2 api.
 */
function d2Api(RestangularProvider) {

    /*****************************************************************************
     * Provided Object definition
     */

    /**
     * @ngdoc service
     * @name d2Api
     *
     * @description
     *
     * This service will be used to communicate with the dhis2-api.
     *
     * ##Detailed description
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
         * @ngdoc method
         * @name d2Api#addEndPoint
         *
         * @param {string} endPointName The name of this endpoint
         * @param {boolean=} isObject If the result is a single object
         *
         * @description
         *
         * This allows you to add an endpoint to the rest service. The endpoint takes a name that
         * is used for the endpoint and a boolean that respresents if the response is an object
         * instead of a list of objects.
         *
         * ###Errors
         *
         * The `addEndPoint` method will throw the following errors
         *
         * #### D2Api Error: EndPoint should not have a leading slash
         * When the endpoint is passed in with a leading slash.
         * Like `addEndPoint('/dataElement')` would throw this error.
         *
         * #### D2Api Error: EndPoint &lt;endPointName&gt; already exists
         * When trying to add an endpoint that already exists it will throw an error.
         * `D2Api Error: EndPoint "' + endPointName + '" already exists`
         *
         * {@note warning Nameing convention
         * The name that is passed in as the endPointName should be the name as it is used in the url.
         * Therefore when trying to create and endpoint for the dataElement api located at
         * `/dhis/api/dataElement`. You would specify the name as `dataElement`. Note the capital E.
         * If the endpoint were to be specified as `dataelement`, the service would call /dhis/api/dataelement.}
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

        /**
         * @ngdoc method
         * @name d2Api#getEndPoint
         *
         * @param {String=} endPointName
         *
         * @returns {Object}
         *
         * @description
         *
         * This will attempt to get an endpoint that is defined on the d2Api object.
         *
         * ### Errors
         *
         * #### D2Api Error: Endpoint does not exist
         * When the endpoint does not exist, trying to get it will throw the does not exist error.
         *
         * {@note info Exposed on object directly
         * The endpoint is also exposed directly on the d2Api object. So when trying to get the `indicators`
         * endpoint instead of using `getEndPoint('indicators')` you could also use `d2Api.indicators` directly.}
         */
        this.getEndPoint = function (endPointName) {
            if (this[endPointName] === undefined) {
                throw 'D2Api Error: Endpoint does not exist';
            }
            return this[endPointName];
        };

        /**
         * @ngdoc method
         * @name d2Api#hasEndPoint
         *
         * @description
         * Check if an endpoint is defined on the d2Api object.
         *
         * @param {String} endPointName The name of the endpoint to check
         * @returns {boolean} True when the endpoint exists, false when it does not.
         */
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
     * @ngdoc method
     * @name d2ApiProvider#config
     *
     * @param {String=} baseUrl
     *
     * @description
     *
     * Set a base url to be used with the api.
     */
    this.setBaseUrl = function (baseUrl) {
        this.config.setBaseUrl(baseUrl);
    };

    /**
     * @ngdoc method
     * @name d2ApiProvider#$get
     *
     * @param {Restangular} Restangular The restangular object instance that is
     *                                  configured through the restangular provider.
     * @returns {d2Api} d2Api This is the rest-api service that is provided after being configured
     *                        by the set providers.
     *
     * @description
     *
     * This is the provider method for the d2Api. This will create a new instance of the d2Api.
     * The D2Api is basically a wrapper object for Restangular with some dhis2 api
     * sugar methods and properties.
     */
    this.$get = function (Restangular) {
        var api;

        api = D2ApiRest;
        api.prototype = Restangular;

        return new D2ApiRest();
    };

    /**
     * @ngdoc property
     * @name d2ApiProvider#config
     *
     * @type {Object} RestangularProvider instance
     *
     * @description
     *
     * Expose the restangularProvider so settings can be set that we didn't expose
     * through shorthand methods.
     */
    this.config = RestangularProvider;

    /*****************************************************************************
     * Do some extra default configuration specific to our (DHIS2) Api
     */

    /**
     * Response interceptor that takes the data from the endpoint and extracts the meta
     * data that is wrapped around it.
     */
    this.config.addResponseInterceptor(function (data, operation, what) {
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
    this.config.setResponseExtractor(function (response) {
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
        if (angular.isString(element)) {
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
}
d2Api.$inject = ["RestangularProvider"];

/**
 * TODO: find a way how to define requires that depend on angular modules/objects
 * The userIsLoggedOutInterceptor should have a requires statement that it depends on $window
 *
 * @requires $window
 */
/**
 * @ngdoc function
 * @name userIsLoggedOutInterceptor
 *
 *
 * @description
 *
 * This interceptor is used to identify when the session expired and the user
 * is logged out. We currently reload the page when the d2Rest service requests a page
 * that returns a response that contains the html fragment `<body class="loginPage">`.
 */
function userIsLoggedOutInterceptor($window) {
    return {
        response: function (response) {
            if (response && typeof response.data === 'string' &&
                response.data.indexOf('<body class="loginPage">') >= 0) {
                $window.location.reload();
            }

            return response;
        }
    };
}
userIsLoggedOutInterceptor.$inject = ["$window"];

function restConfig($httpProvider, d2ApiProvider) {
    $httpProvider.interceptors.push('userIsLoggedOutInterceptor');
    d2ApiProvider.setBaseUrl('/dhis/api');
}
restConfig.$inject = ["$httpProvider", "d2ApiProvider"];

angular.module('d2-rest').provider('d2Api', d2Api);
angular.module('d2-rest').factory('userIsLoggedOutInterceptor', userIsLoggedOutInterceptor);
angular.module('d2-rest').config(restConfig);

function schemaProcessor() {
    return function (providedSchemas) {
        var schemaProcessor,
            SchemaProcessorConstructor = function () {
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
                        schemaGroups[groupName].push(schema);
                    });
                    this.schemaGroups = schemaGroups;
                    return schemaGroups;
                };

                this.filterSchemasByPermissions = function (userPermissions) {
                    var authorizedSchemas = [];

                    angular.forEach(this.schemas, function (schema) {
                        if (schema.isAuthorizedBy(userPermissions)) {
                            authorizedSchemas.push(schema);
                        }
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
                                    permissions.remove = permission.authorities;
                                } else {
                                    permissions[permission.type.toLowerCase()] = permission.authorities;
                                }
                                permissions.all = permissions.all.concat(permission.authorities);

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
                        };
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
                        if (schemas[name]) {
                            filteredSchemaGroups[name] = schemas[name];
                        }
                    });

                    return filteredSchemaGroups;
                };
            };

        schemaProcessor = new SchemaProcessorConstructor();
        schemaProcessor.process(providedSchemas || []);

        return schemaProcessor;
    };
}

angular.module('d2-services').factory('schemaProcessor', schemaProcessor);

function systemSettingsService(d2Api) {
    var settings = {};

    this.getAll = function () {
        return settings;
    };

    this.get = function (key) {
        return settings[key];
    };

    /**
     * Loading of the system settings
     */
    d2Api.addEndPoint('systemSettings', true);
    d2Api.systemSettings.get().then(function (settingsData) {
        angular.extend(settings, settingsData.getDataOnly());
    });
}
systemSettingsService.$inject = ["d2Api"];

angular.module('d2-settings', ['d2-rest']).service('systemSettingsService', systemSettingsService);

function d2LanguageLoader($q, $http, translateApiService) {
    var loadedValues = {};

    return function (options) {
        var deferred = $q.defer();

        if (loadedValues[options.key]) {
            loadedValues[options.key] = angular.extend(translateApiService.apiTranslations, loadedValues[options.key]);
            deferred.resolve(angular.extend(translateApiService.apiTranslations, loadedValues[options.key]));
        } else {
            $http.get('common/i18n/' + options.key + '.json').success(function (data) {
                loadedValues[options.key] = angular.extend(translateApiService.apiTranslations, data);
                deferred.resolve(loadedValues[options.key]);
            }).error(function () {
                deferred.reject(options.key);
            });
        }
        return deferred.promise;
    };
}
d2LanguageLoader.$inject = ["$q", "$http", "translateApiService"];

function d2MissingTranslationHandler(translateApiService) {
    return function (translationId, $uses) {
        translateApiService.add(translationId);
        translateApiService.translateThroughApi($uses);
    };
}
d2MissingTranslationHandler.$inject = ["translateApiService"];

function translateApiService($q, $translate, apiConfig, $timeout, $http) {
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
    };

    this.translateThroughApi = function (languageCode) {
        if (timeOutSet === false) {
            this.getTranslationsFromApi(languageCode).then(function (data) {
                self.apiTranslations = data;
                $translate.refresh();
            });
        }
    };
}
translateApiService.$inject = ["$q", "$translate", "apiConfig", "$timeout", "$http"];

function translateConfig($translateProvider) {
    $translateProvider.useLoader('d2LanguageLoader');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useMissingTranslationHandler('d2MissingTranslationHandler');
}
translateConfig.$inject = ["$translateProvider"];

angular.module('d2-translate').factory('d2MissingTranslationHandler', d2MissingTranslationHandler);
angular.module('d2-translate').service('translateApiService', translateApiService);
angular.module('d2-translate').factory('d2LanguageLoader', d2LanguageLoader);
angular.module('d2-translate').config(translateConfig);

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
function typeAheadService() {
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
}

angular.module('d2-typeahead').service('typeAheadService', typeAheadService);

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

})(angular);
