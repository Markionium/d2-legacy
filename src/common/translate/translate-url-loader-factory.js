function d2LanguageLoader($q, $http, translateServiceTranslations) {
    var loadedValues = {};

    return function (options) {
        var deferred = $q.defer();

        if (loadedValues[options.key]) {
            loadedValues[options.key] = angular.extend(translateServiceTranslations.translations, loadedValues[options.key]);
            deferred.resolve(angular.extend(translateServiceTranslations.translations, loadedValues[options.key]));
        } else {
            $http.get('common/i18n/' + options.key + '.json').success(function (data) {
                loadedValues[options.key] = angular.extend(translateServiceTranslations.translations, data);
                deferred.resolve(loadedValues[options.key]);
            }).error(function () {
                deferred.reject(options.key);
            });
        }
        return deferred.promise;
    };
}

function d2MissingTranslationHandler(translateApiService) {
    return function (translationId, $uses) {
        translateApiService.add(translationId);
        translateApiService.translateThroughApi($uses);
    };
}

function translateServiceTranslations() {
    this.translations = {};
}

function translateApiService($q, $translate, apiConfig, $timeout, $http, translateServiceTranslations) {
    var self = this;
    var timeOutSet = false;
    var translateKeys = [];

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
                translateServiceTranslations.translations = data;
                $translate.refresh();
            });
        }
    };
}

function translateConfig($translateProvider) {
    $translateProvider.useLoader('d2LanguageLoader');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useMissingTranslationHandler('d2MissingTranslationHandler');
}

angular.module('d2-translate').factory('d2MissingTranslationHandler', d2MissingTranslationHandler);
angular.module('d2-translate').service('translateApiService', translateApiService);
angular.module('d2-translate').service('translateServiceTranslations', translateServiceTranslations);
angular.module('d2-translate').factory('d2LanguageLoader', d2LanguageLoader);
angular.module('d2-translate').config(translateConfig);
