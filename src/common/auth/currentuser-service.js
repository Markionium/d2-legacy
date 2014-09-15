function currentUser(d2Api, $q) {
    var permissions;
    var user;

    function loadPermissions() {
        var permissionPromise = d2Api.currentUser.permissions.getList().then(function (response) {
            permissions = response.getDataOnly();
            return permissions;
        });

        function hasPermission(permissionToCheck) {
            return permissionPromise.then(function (permissions) {
                if (permissions.indexOf(permissionToCheck) > 0) {
                    return true;
                } else {
                    return $q.reject('User does not have this permission');
                }
            });
        }

        permissionPromise.hasPermission = hasPermission;
        return permissionPromise;
    }

    /**
     * Loading of the user profile
     */
    user = d2Api.currentUser.get();
    user.then(function (response) {
        angular.extend(user, response.getDataOnly());
    });

    return angular.extend(user, {
        getValue: function (valueKey) {
            if (this[valueKey]) {
                return this[valueKey];
            } else {
                return undefined;
            }
        },
        permissions: loadPermissions()
    });
}

angular.module('d2-auth').factory('currentUser', currentUser);
