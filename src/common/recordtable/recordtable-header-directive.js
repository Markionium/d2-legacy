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
 * Created by Mark Polak on 21 Jul 2014.
 */
!function (angular, undefined) {
    var recordTable = angular.module('d2-recordtable');

    /**
     * @ngdoc directive
     * @name recordTableHeader
     *
     * @restrict AC
     * @scope
     *
     * @requires recordTable
     *
     * @description
     *
     * This directive represents the column headers as they are displayed by the {@link recordTable} directive.
     *
     * The directive adds the sort functionality and calls the setSortOrder function on {@link RecordTableController}.
     *
     * An input box with be added to the column header when `column.searchable` is set to true.
     *
     * When typeahead is available it asks for the typeahead values on {@link RecordTableController} through the `typeAheadCache` property.
     *
     */
    recordTable.directive('recordTableHeader', function () {
        return {
            restrict: 'AC',
            replace: true,
            require: '^recordTable',
            transclude: true,
            scope: {
                column: '='
            },
            template: '<th class="table-header"><a ng-click="sortOrder()" href="#" ng-if="column.sortable" ng-transclude ng-class="\'sorting-\' + column.sort"></a><span ng-if="!column.sortable" ng-transclude></span><input ng-if="column.searchable" ng-model="column.filter" type="text" typeahead="name for name in getTypeAheadFor(column) | filter:$viewValue | limitTo:8"></th>',
            link: function (scope, element, attr, parentCtrl) {
                scope.sortOrder = function (event) {
                    parentCtrl.setSortOrder(scope.column);
                }

                scope.getTypeAheadFor = function (column) {
                    return parentCtrl.typeAheadCache[column.name];
                }
            }
        };
    });
}(angular);