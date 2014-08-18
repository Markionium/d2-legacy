"use strict";

d2Auth.service('currentUser', function (d2Api) {
    var self = this,
        permissionPromise,
        permissions;

    this.userLoaded = false;
    this.permissionsLoaded = false;

    this.getPermissions = function () {
        return permissionPromise;
    };

    this.hasPermission = function (permissionToCheck) {
        return permissions.indexOf(permissionToCheck) > 0 ? true : false;
    };

    /**
     * Loading of the user profile
     */
    d2Api.currentUser.get().then(function (response) {
        angular.extend(self, response.getDataOnly());
    });

    permissionPromise = d2Api.currentUser.permissions.getList().then(function (response) {
        self.permissionsLoaded = true;
        permissions = response.getDataOnly();
        return permissions;
    });
});
