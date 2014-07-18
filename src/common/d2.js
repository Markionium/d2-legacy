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
        scriptPath: function () {
            var scripts = document.getElementsByTagName("script")
            var currentScriptPath = scripts[scripts.length-1].src;

            return currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1);
        }
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
