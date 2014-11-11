/* jshint ignore:start */
// jscs:disable
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if ("document" in self && !("classList" in document.createElement("_"))) {

    (function (view) {

        "use strict";

        if (!('Element' in view)) return;

        var
            classListProp = "classList"
            , protoProp = "prototype"
            , elemCtrProto = view.Element[protoProp]
            , objCtr = Object
            , strTrim = String[protoProp].trim || function () {
                return this.replace(/^\s+|\s+$/g, "");
            }
            , arrIndexOf = Array[protoProp].indexOf || function (item) {
                var
                    i = 0
                    , len = this.length
                    ;
                for (; i < len; i++) {
                    if (i in this && this[i] === item) {
                        return i;
                    }
                }
                return -1;
            }
        // Vendors: please allow content code to instantiate DOMExceptions
            , DOMEx = function (type, message) {
                this.name = type;
                this.code = DOMException[type];
                this.message = message;
            }
            , checkTokenAndGetIndex = function (classList, token) {
                if (token === "") {
                    throw new DOMEx(
                        "SYNTAX_ERR"
                        , "An invalid or illegal string was specified"
                    );
                }
                if (/\s/.test(token)) {
                    throw new DOMEx(
                        "INVALID_CHARACTER_ERR"
                        , "String contains an invalid character"
                    );
                }
                return arrIndexOf.call(classList, token);
            }
            , ClassList = function (elem) {
                var
                    trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                    , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                    , i = 0
                    , len = classes.length
                    ;
                for (; i < len; i++) {
                    this.push(classes[i]);
                }
                this._updateClassName = function () {
                    elem.setAttribute("class", this.toString());
                };
            }
            , classListProto = ClassList[protoProp] = []
            , classListGetter = function () {
                return new ClassList(this);
            }
            ;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
        DOMEx[protoProp] = Error[protoProp];
        classListProto.item = function (i) {
            return this[i] || null;
        };
        classListProto.contains = function (token) {
            token += "";
            return checkTokenAndGetIndex(this, token) !== -1;
        };
        classListProto.add = function () {
            var
                tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
                ;
            do {
                token = tokens[i] + "";
                if (checkTokenAndGetIndex(this, token) === -1) {
                    this.push(token);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.remove = function () {
            var
                tokens = arguments
                , i = 0
                , l = tokens.length
                , token
                , updated = false
                ;
            do {
                token = tokens[i] + "";
                var index = checkTokenAndGetIndex(this, token);
                if (index !== -1) {
                    this.splice(index, 1);
                    updated = true;
                }
            }
            while (++i < l);

            if (updated) {
                this._updateClassName();
            }
        };
        classListProto.toggle = function (token, force) {
            token += "";

            var
                result = this.contains(token)
                , method = result ?
                    force !== true && "remove"
                    :
                    force !== false && "add"
                ;

            if (method) {
                this[method](token);
            }

            return typeof force === "boolean" ? force : !result;
        };
        classListProto.toString = function () {
            return this.join(" ");
        };

        if (objCtr.defineProperty) {
            var classListPropDesc = {
                get: classListGetter
                , enumerable: true
                , configurable: true
            };
            try {
                objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
            } catch (ex) { // IE 8 doesn't support enumerable:true
                if (ex.number === -0x7FF5EC54) {
                    classListPropDesc.enumerable = false;
                    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                }
            }
        } else if (objCtr[protoProp].__defineGetter__) {
            elemCtrProto.__defineGetter__(classListProp, classListGetter);
        }

    }(self));

}
/* jshint ignore:end */
// jscs:enable

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
angular.module('d2-rest', ['restangular', 'd2-config']);
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
 * @name d2-period
 *
 *
 * @description
 *
 * # d2-period
 *
 * The period module contains the directives and services that are required to show a period selector.
 *
 */
angular.module('d2-period', ['ui.select']);

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
