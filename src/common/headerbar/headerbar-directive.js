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
            templateUrl: 'common/headerbar/headerbar.html',
            compile: function (element, attrs) {
                attrs.title = attrs.title || 'District Health Information Software 2';
                attrs.link = attrs.link || '../dhis-web-dashboard-integration/index.action';
                attrs.logo = attrs.logo || '../dhis-web-commons/css/light_blue/logo_banner.png';
            }
        };
    });
}(angular);
