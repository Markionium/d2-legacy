/**
 * @ngdoc service
 * @name breadCrumbsService
 *
 * @description
 *
 * Service that manages the breadcrumbs list. Use this service throughout your app to
 * modify the breadcrumbs list.
 */
angular.module('d2-breadcrumbs').service('breadCrumbsService', function () {
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
    };
});
