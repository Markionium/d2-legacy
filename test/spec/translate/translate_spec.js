describe('Translate', function () {
    var $translate,
        returnedTranslations = {"yes":"Oui"};

    beforeEach(module('d2-translate', function ($provide, $translateProvider) {

        $provide.factory('customLoader', function ($q) {
            return function () {
                var deferred = $q.defer();
                deferred.resolve(returnedTranslations);
                return deferred.promise;
            };
        });

        $translateProvider.useLoader('customLoader');
    }));
    beforeEach(inject(function (_$translate_, _$rootScope_) {
        $translate = _$translate_;
        $rootScope = _$rootScope_;
    }));

    it('should return oui when trying to translate yes', function () {
        var translations;
        $translate(['yes']).then(function (data) {
            translations = data;
        });

        $rootScope.$apply();

        expect(translations.yes).toBe('Oui');
    });

    it('should ask the translateService for a translation when it cannot be found', inject(function (translateApi) {
        spyOn(translateApi, 'add');

        $translate(['no']).then(function (data) {
            translations = data;
        });

        $rootScope.$apply();

        expect(translateApi.add).toHaveBeenCalledOnce();
    }));
});
