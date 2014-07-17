describe('User Profile Service', function () {
    var user,
        $httpBackend;

    beforeEach(function () {
        this.addMatchers(jasmine_custom_matchers);
    });

    beforeEach(module('d2-services'));
    beforeEach(inject(function ($injector) {
        user = $injector.get('currentUser');
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.expectGET('/dhis/api/me').respond(200, fixtures.api.me.me);
        $httpBackend.expectGET('/dhis/api/me/authorization').respond(200, fixtures.api.me.authorization);
    }));

    it('should have a userLoaded property', function () {
        expect(user.userLoaded).toBe(false);
    });

    describe('Authorization', function () {

        beforeEach(function () {

        });

        it('should have a permissions method', function () {
            expect(user).toHaveMethod('getPermissions');
        });

        it('should load the list from the api', function () {
            var permissions;

            user.getPermissions().then(function (recievedPermissions) {
                permissions = recievedPermissions;
            });

            $httpBackend.flush();

            expect(permissions.length).toBe(204);
        });

        it('should return true if the user has a permission', function () {
            user.getPermissions();

            $httpBackend.flush();

            expect(user.hasPermission('F_SECTION_ADD')).toBe(true);
        });

        it('should return false when the user does not have a permission', function () {
            user.getPermissions();

            $httpBackend.flush();

            expect(user.hasPermission('unknown_permission')).toBe(false);
        });

        it('should set the username', function () {
            $httpBackend.flush();

            expect(user.name).toBe('John Traore');
        });

        it('should have a method that returns all permissions', function () {
            var userPermissions;

            user.getPermissions().then(function (permissions) {
                userPermissions = permissions;
            });

            $httpBackend.flush();

            expect(userPermissions).toEqual(fixtures.api.me.authorization);
        });

        it('should have a property for permissions loaded', function () {
            expect(user.permissionsLoaded).toBe(false);
        });

        it('should set permissions loaded to true after loading permissions', function () {
            expect(user.permissionsLoaded).toBe(false);

            user.getPermissions();

            $httpBackend.flush();

            expect(user.permissionsLoaded).toBe(true);
        });
    });
});
