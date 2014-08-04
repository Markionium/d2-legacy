d2Translate.factory('d2LanguageLoader', function ($q, $http, apiConfig, translateApi) {
    var loadedValues = {};

    function getStaticFiles(key) {
        var deferred = $q.defer();

        if (loadedValues[key]) {
            deferred.resolve(loadedValues[key]);
        } else {
            $http.get('common/i18n/' + key + '.json').success(function (data) {
                loadedValues[key] = data;
                deferred.resolve(data);
            }).error(function (data) {
                deferred.reject(key);
            });
        }
        return deferred.promise;
    }

    function getTranslationsFromApi(translationKeys) {
        var deferred = $q.defer();
        $http.post(apiConfig.getUrl('i18n'), translationKeys).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }

    return function (options, $uses) {
        var translationKeys = translateApi.getTranslationKeys(),
            promises = [];
        promises.push(getStaticFiles(options.key));

        if (translationKeys.length > 0) {
            promises.push(getTranslationsFromApi(translationKeys));
        }
        return $q.all(promises).then(function (data) {
            var result = {};
            _.map(data, function (item) {
                _.merge(result, item);
            });
            return _.merge(result);
        });
    };
});

d2Translate.factory('d2MissingTranslationHandler', function ($translate, translateApi) {
    return function (translationId, $uses) {
        translateApi.add('translationId');
        $translate.refresh();
    }
});

d2Translate.service('translateApi', function () {
    var translateKeys = [];
    this.add = function (translationId) {
        if (angular.isString(translationId) && translationId.trim() !== '') {
            translateKeys.push(translationId.trim());
            translateKeys = _.uniq(translateKeys);
        }
    };

    this.getTranslationKeys = function () {
        return translateKeys;
    };
});

d2Translate.config(function ($translateProvider) {
    $translateProvider.useLoader('d2LanguageLoader');
    $translateProvider.preferredLanguage('en');
    $translateProvider.useMissingTranslationHandler('d2MissingTranslationHandler');
});