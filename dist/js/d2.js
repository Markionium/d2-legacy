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
/**
 * Created by Mark Polak on 19/06/14.
 */
/**
 * Create the modules that go into d2.
 * TODO: This should be able to be build by some build tool that includes only the modules you need
 *       based on what directives / services you use.
 */
!function (angular, d2, undefined) {

    //TODO Write tests for this.
    d2.utils = {
        scriptPath: (function () {
            var d2ScriptPath;

            return function () {
                var scripts,
                    currentScriptPath,
                    d2ScriptTag = angular.element('<script src=""></script>');

                if (d2ScriptPath) {
                    return d2ScriptPath;
                }

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

    angular.module('d2-services', ['d2-rest']);

    angular.module('d2-filters', []);

    angular.module('d2-datatable', ['d2-filters']);

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
     * <a src="https://www.google.no/images/srpr/logo11w.png">
     */
    angular.module('d2-introlist', []);

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
    angular.module('d2-directives', ['d2-breadcrumbs', 'd2-introlist', 'd2-headerbar', 'd2-datatable']);

    angular.module('d2', ['d2-services', 'd2-directives', 'd2-filters']);
}(angular, window.d2 = window.d2 || {});

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
/**
 * Created by Mark Polak on 03 Jul 2014.
 */
!function (angular, undefined) {
    /**
     * @ngdoc directive
     * @name d2BreadCrumbs
     *
     * @requires d2BreadCrumbsService
     *
     * @restrict E
     * @scope
     *
     * @param {Object} crumbsList A instance of {@link d2BreadCrumbsService}
     *
     * @description
     *
     * Directive to show a list of breadcrumbs at the place where the directive is inserted.
     * The breadcrumbs crumbs can be modified by using the {@link d2BreadCrumbsService}
     */
    angular.module('d2-breadcrumbs').directive('d2BreadCrumbs', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            //For testing this resolves to 'common/breadcrumbs/breadcrumbs.html'
            templateUrl: d2.utils.scriptPath() + 'common/breadcrumbs/breadcrumbs.html',
            controller: ["$scope", "d2BreadCrumbsService", function ($scope, d2BreadCrumbsService) {
                $scope.crumbsList = d2BreadCrumbsService.getCrumbsList();

                $scope.crumbClick = function (crumb) {
                    d2BreadCrumbsService.resetCrumbs(crumb.id);
                    $scope.crumbsList = d2BreadCrumbsService.getCrumbsList();

                    if (crumb.click) {
                        crumb.click(angular.copy(crumb));
                    }
                };
            }]
        };
    });
}(angular);

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
/**
 * Created by Mark Polak on 03 Jul 2014.
 */
!function (angular, undefined) {
    /**
     * @ngdoc service
     * @name d2BreadCrumbsService
     *
     * @description
     *
     * Service that manages the breadcrumbs list. Use this service throughout your app to
     * modify the breadcrumbs list.
     */
    angular.module('d2-breadcrumbs').service('d2BreadCrumbsService', function () {
        /**
         * @ngdoc property
         * @name d2BreadCrumbsService#crumbsList
         *
         * @kind array
         *
         * @description
         *
         * The array that holds the crumbs list and that can be used to in the crumbs directive.
         * This contains objects that represent the various crumbs. A crumb has the following format.
         * <pre>
         *    {
         *       //Name of the breadcrumb
         *       name: "CrumbName",
         *
         *       // Id of the breadcrumb, this is calculated based on the length of the array
         *       id: 0,
         *
         *       // When a callback is provided when the crumb is added the click function
         *       // set to be used when the crumb is clicked.
         *       click: function () {}
         *    }
         * </pre>
         */
        this.crumbsList = [];

        /**
         * @ngdoc method
         * @name d2BreadCrumbsService#addCrumb
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

            crumb.name = name;
            crumb.id = this.crumbsList.length;

            if (callback && angular.isFunction(callback)) {
                //var resetCrumbs = this.resetCrumbs.bind(this);
                crumb.click = function () {
                    //resetCrumbs(crumb.id);
                    return callback();
                };
            }
            this.crumbsList.push(crumb);
        };

        /**
         * @ngdoc method
         * @name d2BreadCrumbsService#resetCrumbs
         *
         * @param {Integer=} id
         *
         * @description
         *
         * Resets the crumb list when an id is passed it keeps the crumbs before that point
         */
        this.resetCrumbs = function (id) {
            if (id === undefined){
                id = 0;
            }

            this.crumbsList = _.filter(this.crumbsList, function (crumb) {
                return crumb.id <= id;
            });
        };

        /**
         * @ngdoc method
         * @name d2BreadCrumbsService#getCrumbsList
         *
         * @returns {Array}
         *
         * @description
         *
         * Return the current crumbs list
         */
        this.getCrumbsList = function () {
            return this.crumbsList;
        };
    });
}(angular);

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
/**
 * Created by Mark Polak on 07 Jul 2014.
 */
!function (angular, undefined) {
    var dataTable = angular.module('d2-datatable');

    dataTable.controller('DataTableController', ["$scope", "$q", function ($scope, $q) {
        /**
         * Generates the header names based on the data that is given to the table.
         *
         * @returns {Array|*}
         */
        this.getHeadersFromData = function () {
            var columns = [];

            _.map($scope.items, function (object) {
                var data = object.getDataOnly ? object.getDataOnly() : object;
                _.map(data, function (value, key) {
                    columns.push(key);
                });
                return columns;
            });
            columns = _.uniq(columns);

            $scope.columns = columns;
            return $scope.columns;
        };
        /**
         * Parses the tableData variable on the scope to extract
         * the data we need and puts it on the scope directly
         */
        this.parseTableConfig = function () {
            var tableConfig = $scope.tableConfig || {};

            $scope.pageItems = tableConfig.pageItems;
        };

        /**
         * Wraps the table data is a promise and adds the processData handler
         */
        this.parseTableData = function () {
            $q.when($scope.tableData).then(this.processData.bind(this));
        };

        /**
         * Takes the data and takes/generates needed meta data from it
         *
         * @param data
         */
        this.processData = function (data) {
            $scope.items = data;
            $scope.columns = $scope.columns || this.getHeadersFromData();

            if ($scope.pageItems) {
                $scope.items = $scope.items.slice(0, $scope.pageItems);
            }
        };
    }]);

    dataTable.directive('d2DataTable', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                tableConfig: '=',
                tableData: '='
            },
            templateUrl: d2.utils.scriptPath() + 'common/datatable/datatable.html',
            controller: 'DataTableController',
            link: function (scope, element, attrs, controller) {
                controller.parseTableConfig();
                controller.parseTableData();
            }
        };
    });
}(angular);

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
/**
 * Created by Mark Polak on 07 Jul 2014.
 */
!function (angular, undefined) {
    angular.module('d2-datatable').provider('d2DataTableCreator', function () {
/*        var defaults;

        defaults = {
            count: 25,
            page: 1,
            columns: [
                { title: 'Name', field: 'name', visible: true, filter: { 'name': 'text' } }
            ]
        };

        return {
            $get: function () {
                return function (options) {
                    var tableParams, params;

                    options = angular.extend(defaults, options || {});
                    tableParams = {
                        total: function (value) {
                            if (typeof value === 'number') {
                                return value;
                            } else {
                                return params.total;
                            }
                        }
                    };
                    tableParams = angular.extend(options, tableParams);

                    return tableParams;
                };
            }
        };*/
        return {
            $get: function () {
                return function () {
                    return {};
                };
            }
        }
    });
}(angular);


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
/**
 * Created by Mark Polak on 09 Jul 2014.
 */
!function (angular, undefined) {
    angular.module('d2-filters').filter('capitalize', function () {
        return function(input) {
            if (angular.isString(input)) {
                return input.charAt(0).toUpperCase() + input.slice(1);
            }
            return input;
        };
    });
}(angular);

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
/**
 * Created by Mark Polak on 2014-54-27.
 */
!function(angular, undefined) {
    var d2HeaderBar = angular.module('d2-headerbar');
    /**
     * @ngdoc directive
     * @name d2HeaderBar
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
    d2HeaderBar.directive('d2HeaderBar', function () {
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
            templateUrl: d2.utils.scriptPath() + 'common/headerbar/headerbar.html',
            compile: function (element, attrs) {
                attrs.title = attrs.title || 'District Health Information Software 2';
                attrs.link = attrs.link || '../dhis-web-dashboard-integration/index.action';
                attrs.logo = attrs.logo || '../dhis-web-commons/css/light_blue/logo_banner.png';
            }
        };
    });
}(angular);

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
/**
 * Created by Mark Polak on 19/06/14.
 */
!function(angular, undefined) {
    /**
     * @ngdoc directive
     * @name d2IntroList
     *
     * @scope
     * @restrict E
     *
     * @param {Array} itemList The itemList passed in should be a array with objects of the following format
     * <pre>
     *     {
     *       action: <string>       // Url of where the link should go to
     *       name: <string>         // Name of the item that will be displayed
     *       description: <string>  // Description of the menu items
     *       icon: <string>         // Icon that should be shown
     *     }
     * </pre>
     *
     * @description
     *
     * Directive to create a list menu items with a small intro text and an icon.
     *
     * TODO: ADD Picture
     */
    angular.module('d2-introlist').directive('d2IntroList', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                itemList: '=',
                itemClick: '&'
            },
            templateUrl: d2.utils.scriptPath() + 'common/introlist/introlist.html',
            link: function (scope) {
                scope.clickFunction = function (item) {
                    var itemToPass = {item: angular.copy(item)};
                    scope.itemClick(itemToPass);
                };
            }
        };
    });
}(angular);

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
/**
 * Created by Mark Polak on 2014-07-30.
 */

!function(angular, undefined) {
    angular.module('d2-services').service('currentUser', ["d2Api", function (d2Api) {
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
}(angular);

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
/**
 * Created by Mark Polak on 2014-40-29.
 */
!function(angular, undefined) {
    var d2Rest = angular.module('d2-rest', ['restangular']);

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
             */
            this.addEndPoint = function (endPointName, isObject) {
                if (isObject) {
                    this[endPointName] = this.one('endPointName');
                } else {
                    this[endPointName] = this.all('endPointName');
                }
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
}(angular);

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
/**
 * Created by Mark Polak on 30 Jun 2014.
 */
!function(angular, undefined) {
    angular.module('d2-services').factory('schemaProcessor', function () {
        return function(providedSchemas) {
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
                        };
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
}(angular);
