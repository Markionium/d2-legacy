angular.module('d2-translate').factory('d2LanguageLoader', function ($q, $http, translateApi) {
    var loadedValues = {};

    return function (options) {
        var deferred = $q.defer();

        if (loadedValues[options.key]) {
            loadedValues[options.key] = angular.extend(translateApi.apiTranslations, loadedValues[options.key]);
            deferred.resolve(angular.extend(translateApi.apiTranslations, loadedValues[options.key]));
        } else {
            $http.get('common/i18n/' + options.key + '.json').success(function (data) {
                loadedValues[options.key] = angular.extend(translateApi.apiTranslations, data);
                deferred.resolve(loadedValues[options.key]);
            }).error(function () {
                deferred.reject(options.key);
            });
        }
        return deferred.promise;
    };
});

angular.module('d2-translate').factory('d2MissingTranslationHandler', function ($translate, translateApi) {
    return function (translationId, $uses) {
        translateApi.add(translationId);
        translateApi.translateThroughApi($uses);
    };
});

angular.module('d2-translate').service('translateApi', function ($q, $translate, apiConfig, $timeout, $http) {
    var self = this;
    var timeOutSet = false;
    var translateKeys = [];

    this.apiTranslations = {};
    this.add = function (translationId) {
        if (angular.isString(translationId) && translationId.trim() !== '') {
            translateKeys.push(translationId.trim());
            translateKeys = _.uniq(translateKeys);
        }
    };

    this.getTranslationKeys = function () {
        var result = translateKeys;
        translateKeys = [];
        return result;
    };

    this.getTranslationsFromApi = function (languageCode) {
        var deferred = $q.defer();

        if (timeOutSet) {
            deferred.reject('waiting');
        }
        timeOutSet = true;
        $timeout(function () {
            var translations = self.getTranslationKeys();
            $http.post(apiConfig.getUrl('i18n'), translations).success(function (data) {
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(data);
            });
            $translate.refresh(languageCode);
            timeOutSet = false;
        }, 100, false);

        return deferred.promise;
    };

    this.translateThroughApi = function (languageCode) {
        if (timeOutSet === false) {
            this.getTranslationsFromApi(languageCode).then(function (data) {
                self.apiTranslations = data;
                $translate.refresh();
            });
        }
    };
});

angular.module('d2-translate').config(function ($translateProvider) {
    $translateProvider.useLoader('d2LanguageLoader');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useMissingTranslationHandler('d2MissingTranslationHandler');
});
