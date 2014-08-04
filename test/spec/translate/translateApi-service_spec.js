describe('Translate Api Service', function () {
    var translateApi,
        $rootScope,
        returnedTranslations = [];

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

    beforeEach(inject(function (_translateApi_, _$rootScope_) {
        translateApi = _translateApi_;
        $rootScope = _$rootScope_;
    }));

    it('should have an add method', function () {
        expect(translateApi).toHaveMethod('add')
    });

    it('should have a method getTranslationKeys', function () {
        expect(translateApi).toHaveMethod('getTranslationKeys');
    });

    it('should return an empty array when calling getTranslationKeys', function () {
        expect(translateApi.getTranslationKeys()).toEqual([]);
    });

    it('should add a key to the translation array after calling add', function () {
        translateApi.add('yes');

        expect(translateApi.getTranslationKeys()).toEqual(['yes']);
    });

    it('should not add the same key twice', function () {
        translateApi.add('yes');
        translateApi.add('yes');

        expect(translateApi.getTranslationKeys()).toEqual(['yes']);
    });

    it('should not add a key that is not a string', function () {
        translateApi.add([]);
        translateApi.add({});

        expect(translateApi.getTranslationKeys()).toEqual([]);
    });

    it('should not add an empty string', function () {
        translateApi.add('');

        expect(translateApi.getTranslationKeys()).toEqual([]);
    });

    it('should not add a string that exists of whitespace', function () {
        translateApi.add('  ');
        translateApi.add('\t');
        translateApi.add('\r\n');

        expect(translateApi.getTranslationKeys()).toEqual([]);
    });

    it('should trim whitespace from the identifiers', function () {
        translateApi.add(' yes ');

        expect(translateApi.getTranslationKeys()).toEqual(['yes']);
    });
});
