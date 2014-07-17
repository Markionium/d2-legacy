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
            templateUrl: 'components/common/breadcrumbs/breadcrumbs.html',
            controller: function ($scope, d2BreadCrumbsService) {
                $scope.crumbsList = d2BreadCrumbsService.getCrumbsList();

                $scope.crumbClick = function (crumb) {
                    d2BreadCrumbsService.resetCrumbs(crumb.id);
                    $scope.crumbsList = d2BreadCrumbsService.getCrumbsList();

                    if (crumb.click) {
                        crumb.click(angular.copy(crumb));
                    }
                };
            }
        };
    });
}(angular);
