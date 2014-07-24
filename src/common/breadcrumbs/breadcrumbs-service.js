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
     * @name breadCrumbsService
     *
     * @description
     *
     * Service that manages the breadcrumbs list. Use this service throughout your app to
     * modify the breadcrumbs list.
     */
    angular.module('d2-breadcrumbs').service('breadCrumbsService', function () {
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
            if (id === undefined){
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
}(angular);
