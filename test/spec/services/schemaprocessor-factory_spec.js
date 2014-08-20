describe('SchemaProcessor', function () {
    var schemaProcessor;

    beforeEach(module('d2-services'));
    beforeEach(inject(function ($injector) {
        schemaProcessor = $injector.get('schemaProcessor');
    }));

    it('should grab the groupname from a klass name', function () {
        var name = schemaProcessor([{}]).getKlassGroupName('org.hisp.dhis.eventreport.EventReport');

        expect(name).toBe('eventreport');
    });

    it('should filter schemas and put them in groups by klassgroupname', function () {
        var schemas = fixtures.api.schemas.all.schemas,
            schemaGroups;

        schemaGroups = schemaProcessor(schemas).addSchemasToGroups(schemas);

        expect(schemaGroups['dataelement']).toBeDefined();
        expect(schemaGroups['dataelement'].length).toBe(10);
    });

    it('should filter schemas by permissions', function () {
        var schemas = fixtures.api.schemas.all.schemas,
            userPermissions = [
                'F_ORGANISATIONUNIT_ADD',
                'F_CATEGORY_OPTION_GROUP_SET_PUBLIC_ADD',
                'F_CATEGORY_OPTION_GROUP_SET_PRIVATE_ADD'
            ],
            authorizedSchemas;

        authorizedSchemas = schemaProcessor(schemas).filterSchemasByPermissions(userPermissions);

        expect(authorizedSchemas.length).toBe(2);
        expect(authorizedSchemas[0].klass).toBe('org.hisp.dhis.dataelement.CategoryOptionGroupSet');
        expect(authorizedSchemas[1].klass).toBe('org.hisp.dhis.organisationunit.OrganisationUnit');
    });

    it('should get permissions from the schema', function () {
        var schemas = fixtures.api.schemas.all.schemas,
            permissions,
            expectedPermissions = {
                create: ['F_RELATIONSHIPTYPE_ADD'],
                remove: ['F_RELATIONSHIPTYPE_DELETE'],
                all: ['F_RELATIONSHIPTYPE_ADD', 'F_RELATIONSHIPTYPE_DELETE']
            };

        permissions = schemaProcessor(schemas).schemas[0].getPermissions(schemas[0]);

        expect(permissions).toEqual(expectedPermissions);
    });

    it('should give a list of schema groups for the permissions', function () {
        var schemas = fixtures.api.schemas.all.schemas,
            schemaGroups,
            userPermissions = [
                'F_ORGANISATIONUNIT_ADD',
                'F_CATEGORY_OPTION_GROUP_SET_PUBLIC_ADD',
                'F_CATEGORY_OPTION_GROUP_SET_PRIVATE_ADD'
            ],

            schemaGroups = schemaProcessor(schemas).getSchemaGroupsForPermissions(userPermissions);

        expect(schemaGroups['organisationunit']).toBeDefined();
        expect(schemaGroups['dataelement']).toBeDefined();
        expect(schemaGroups['organisationunit'][0]).toHaveMethod('isAuthorizedBy');
    });

    it('should not give the groups that are not authorized', function () {
        var schemas = fixtures.api.schemas.all.schemas,
            schemaGroups,
            userPermissions = [
                'F_ORGANISATIONUNIT_ADD',
                'F_CATEGORY_OPTION_GROUP_SET_PUBLIC_ADD',
                'F_CATEGORY_OPTION_GROUP_SET_PRIVATE_ADD'
            ],

            schemaGroups = schemaProcessor(schemas).getSchemaGroupsForPermissions(userPermissions);

        expect(schemaGroups['report']).not.toBeDefined();
    });

    it('should filter the schemas based on a set list of group names', function () {
        var schemas = fixtures.api.schemas.all.schemas,
            schemaGroups;

        schemaGroups = schemaProcessor(schemas).filterByGroupNames(['dataelement']);

        expect(schemaGroups.dataelement).toBeDefined();
        expect(schemaGroups.dataelement[0]).toHaveMethod('isAuthorizedBy');
    });
});
//TODO: Clean up these tests a bit;
