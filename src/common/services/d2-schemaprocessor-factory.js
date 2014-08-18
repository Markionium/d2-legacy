angular.module('d2-services').factory('schemaProcessor', function () {
    return function (providedSchemas) {
        var schemaProcessor,
            SchemaProcessorConstructor = function () {
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
                    }
                    schemaGroups[groupName].push(schema);
                });
                this.schemaGroups = schemaGroups;
                return schemaGroups;
            };

            this.filterSchemasByPermissions = function (userPermissions) {
                var authorizedSchemas = [];

                angular.forEach(this.schemas, function (schema) {
                    if (schema.isAuthorizedBy(userPermissions)) {
                        authorizedSchemas.push(schema);
                    }
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
                                permissions.remove = permission.authorities;
                            } else {
                                permissions[permission.type.toLowerCase()] = permission.authorities;
                            }
                            permissions.all = permissions.all.concat(permission.authorities);

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
                    };
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
                    if (schemas[name]) {
                        filteredSchemaGroups[name] = schemas[name];
                    }
                });

                return filteredSchemaGroups;
            };
        };

        schemaProcessor = new SchemaProcessorConstructor();
        schemaProcessor.process(providedSchemas || []);

        return schemaProcessor;
    };
});
