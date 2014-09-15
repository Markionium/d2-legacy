describe('User Profile Service', function () {
    var user,
        $httpBackend;

    beforeEach(module('d2-services'));
    beforeEach(inject(function ($injector) {
        user = $injector.get('currentUser');
        $httpBackend = $injector.get('$httpBackend');

        $httpBackend.expectGET('/dhis/api/me').respond(200, fixtures.api.me.me);
        $httpBackend.expectGET('/dhis/api/me/authorization').respond(200, fixtures.api.me.authorization);
    }));


    it('should set the username', function () {
        $httpBackend.flush();

        expect(user.name).toBe('John Traore');
    });

    it('should have alternate method to get data', function () {
        $httpBackend.flush();

        expect(user.valueFor('name')).toBe('John Traore');
    });

    it('should be a promise itself', function () {
        $httpBackend.flush();

        expect(user.then).toBeAFunction();
    });

    it('should return a undefined when trying to get a unknown property', function () {
        $httpBackend.flush();

        expect(user.valueFor('name2')).toBe(undefined);
    });

    describe('Authorization', function () {

        beforeEach(function () {

        });

        it('should have a permissions object', function () {
            expect(user.permissions).toBeAnObject();
        });

        it('should load the list from the api', function () {
            var permissions;

            user.permissions.then(function (recievedPermissions) {
                permissions = recievedPermissions;
            });

            $httpBackend.flush();

            expect(permissions.length).toBe(204);
        });

        it('should return true if the user has a permission', function () {
            var hasPermissions = false;

            user.permissions.hasPermission('F_SECTION_ADD').then(function () {
                hasPermissions = true;
            });

            $httpBackend.flush();

            expect(hasPermissions).toBe(true);
        });

        it('should return false when the user does not have a permission', function () {
            var hasPermissions = false;

            user.permissions.hasPermission('unknown permissions').then(function (perm) {
                hasPermissions = true;
            });

            $httpBackend.flush();

            expect(hasPermissions).toBe(false);
        });

        it('should have a method that returns all permissions', function () {
            var userPermissions;

            user.permissions.then(function (permissions) {
                userPermissions = permissions;
            });

            $httpBackend.flush();

            expect(userPermissions).toEqual(fixtures.api.me.authorization);
        });
    });
});
