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
            templateUrl: 'common/introlist/introlist.html',
            link: function (scope) {
                scope.clickFunction = function (item) {
                    var itemToPass = {item: angular.copy(item)};
                    scope.itemClick(itemToPass);
                };
            }
        };
    });
}(angular);
