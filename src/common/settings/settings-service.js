function systemSettingsService(d2Api) {
    var settings = {};

    this.getAll = function () {
        return settings;
    };

    this.get = function (key) {
        return settings[key];
    };

    /**
     * Loading of the system settings
     */
    d2Api.addEndPoint('systemSettings', true);
    d2Api.systemSettings.get().then(function (settingsData) {
        angular.extend(settings, settingsData.getDataOnly());
    });
}

angular.module('d2-settings', ['d2-rest']).service('systemSettingsService', systemSettingsService);
