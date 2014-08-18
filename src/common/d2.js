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
d2Rest = angular.module('d2-rest', ['restangular']);
d2Auth = angular.module('d2-auth', ['d2-rest']);
d2Translate = angular.module('d2-translate', ['pascalprecht.translate', 'd2-config']);

d2ContextMenu = angular.module('d2-contextmenu', []);

/**
 * @ngdoc module
 * @name d2-detailsbox
 *
 * @description
 *
 * This module represents the detailsbox that shows basic details about a record. This
 * can show a list details in key/value format.
 */
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
