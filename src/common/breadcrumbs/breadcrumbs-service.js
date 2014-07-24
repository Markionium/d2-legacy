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
            id = 0;
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
        return this.crumbsList;
    };
});
