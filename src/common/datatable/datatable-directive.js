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
 * Created by Mark Polak on 07 Jul 2014.
 */
!function (angular, undefined) {
    var dataTable = angular.module('d2-datatable');

    dataTable.controller('DataTableController', function ($scope, $q) {
        /**
         * Generates the header names based on the data that is given to the table.
         *
         * @returns {Array|*}
         */
        this.getHeadersFromData = function () {
            var columns = [];

            _.map($scope.items, function (object) {
                var data = object.getDataOnly ? object.getDataOnly() : object;
                _.map(data, function (value, key) {
                    columns.push({
                        name: key
                    });
                });
                return columns;
            });
            columns = _.uniq(columns, function (column) {
                return column.name;
            });

            $scope.columns = columns;
            return $scope.columns;
        };
        /**
         * Parses the tableData variable on the scope to extract
         * the data we need and puts it on the scope directly
         */
        this.parseTableConfig = function () {
            var tableConfig = $scope.tableConfig || {};

            $scope.pageItems = tableConfig.pageItems;
            $scope.columns = tableConfig.columns || undefined;
        };

        /**
         * Wraps the table data is a promise and adds the processData handler
         */
        this.parseTableData = function () {
            $q.when($scope.tableData).then(this.processData.bind(this));
        };

        /**
         * Takes the data and takes/generates needed meta data from it
         *
         * @param data
         */
        this.processData = function (data) {
            $scope.items = data;
            $scope.columns = $scope.columns || this.getHeadersFromData();

            if ($scope.pageItems) {
                $scope.items = $scope.items.slice(0, $scope.pageItems);
            }
        };

        this.setSortOrder = function (currentColumn) {
            var columns = angular.copy($scope.columns);

            angular.forEach(columns, function (column) {
                if (column.name === currentColumn.name) {
                    if (currentColumn.sort === 'asc') {
                        column.sort = 'desc';
                    } else {
                        column.sort = 'asc';
                    }
                } else {
                    column.sort = undefined;
                }
            });

            $scope.columns = columns;
        };

        $scope.$watch('columns', function (newValue, oldValue) {
            if (oldValue !== newValue && $scope.items.length > 0) {
                var sorting = _.filter($scope.columns, 'sort'),
                    sortBy = _.pluck(sorting, 'name'),
                    items;

                //Don't do anything when there is no sorting to be done
                if (sorting.length === 0) return;

                items = _.sortBy($scope.items, sortBy);
                if (sorting[0] && sorting[0].sort === 'desc') {
                    items = items.reverse();
                }

                $scope.items = items;
            };
        }, true);
    });

    dataTable.directive('d2DataTable', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                tableConfig: '=',
                tableData: '='
            },
            templateUrl: d2.utils.scriptPath() + 'common/datatable/datatable.html',
            controller: 'DataTableController',
            link: function (scope, element, attrs, controller) {
                controller.parseTableConfig();
                controller.parseTableData();
            }
        };
    });
}(angular);