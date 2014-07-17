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
 * Created by Mark Polak on 30 Jun 2014.
 */
!function(angular, undefined) {
    angular.module('d2-services').factory('schemaProcessor', function () {
        return function(providedSchemas) {
            var schemaProcessor = new function () {
                this.schemas = [];
                this.schemaGroups = {};

                this.getKlassGroupName = function (klass) {
                    var parts = klass.split('.');
                    return parts[parts.length - 2];
                };

                this.addSchemasToGroups = function (schemas) {
                    var self = this,
                        schemaGroups = {};

                    angular.forEach(schemas, function (schema) {
                        var groupName = self.getKlassGroupName(schema.klass);
                        if (schemaGroups[groupName] === undefined) {
                            schemaGroups[groupName] = [];
                        };
                        schemaGroups[groupName].push(schema);
                    });
                    this.schemaGroups = schemaGroups;
                    return schemaGroups;
                };

                this.filterSchemasByPermissions = function (userPermissions) {
                    var self = this,
                        authorizedSchemas = [];

                    angular.forEach(this.schemas, function (schema) {
                        if (schema.isAuthorizedBy(userPermissions))
                            authorizedSchemas.push(schema);
                    });

                    return authorizedSchemas;
                };

                this.process = function (providedSchemas) {
                    this.schemas = providedSchemas;

                    angular.forEach(this.schemas, function (schema) {
                        schema.getPermissions = function () {
                            var permissions = {
                                all: []
                            };

                            angular.forEach(this.authorities, function (permission) {
                                if (permission.type === 'DELETE') {
                                    permissions['remove'] = permission.authorities;
                                } else {
                                    permissions[permission.type.toLowerCase()] = permission.authorities;
                                }
                                permissions['all'] = permissions['all'].concat(permission.authorities);

                            });
                            return permissions;
                        };
                        schema.isAuthorizedBy = function (userPermissions) {
                            var authorized = false,
                                permissions = schema.getPermissions();
                            angular.forEach(permissions.all, function (permission) {
                                if (userPermissions.indexOf(permission) >= 0) {
                                    schema.permissions = permissions;
                                    authorized = true;
                                }
                            });
                            return authorized;
                        }
                    });
                };

                this.getSchemaGroupsForPermissions = function (permissions) {
                    var authorizedSchemas = this.filterSchemasByPermissions(permissions),
                        schemaGroups = this.addSchemasToGroups(authorizedSchemas);
                    return schemaGroups;
                };

                this.filterByGroupNames = function (names) {
                    var schemas = this.addSchemasToGroups(this.schemas),
                        filteredSchemaGroups = {};

                    angular.forEach(names, function (name) {
                        if (schemas[name])
                            filteredSchemaGroups[name] = schemas[name];
                    });

                    return filteredSchemaGroups;
                };
            };
            schemaProcessor.process(providedSchemas || []);
            return schemaProcessor;
        };
    });
}(angular);
