describe('Translate Api Service', function () {
    var translateApiService,
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

    beforeEach(inject(function (_translateApiService_, _$rootScope_) {
        translateApiService = _translateApiService_;
        $rootScope = _$rootScope_;
    }));

    it('should have an add method', function () {
        expect(translateApiService).toHaveMethod('add')
    });

    it('should have a method getTranslationKeys', function () {
        expect(translateApiService).toHaveMethod('getTranslationKeys');
    });

    it('should return an empty array when calling getTranslationKeys', function () {
        expect(translateApiService.getTranslationKeys()).toEqual([]);
    });

    it('should add a key to the translation array after calling add', function () {
        translateApiService.add('yes');

        expect(translateApiService.getTranslationKeys()).toEqual(['yes']);
    });

    it('should not add the same key twice', function () {
        translateApiService.add('yes');
        translateApiService.add('yes');

        expect(translateApiService.getTranslationKeys()).toEqual(['yes']);
    });

    it('should not add a key that is not a string', function () {
        translateApiService.add([]);
        translateApiService.add({});

        expect(translateApiService.getTranslationKeys()).toEqual([]);
    });

    it('should not add an empty string', function () {
        translateApiService.add('');

        expect(translateApiService.getTranslationKeys()).toEqual([]);
    });

    it('should not add a string that exists of whitespace', function () {
        translateApiService.add('  ');
        translateApiService.add('\t');
        translateApiService.add('\r\n');

        expect(translateApiService.getTranslationKeys()).toEqual([]);
    });

    it('should trim whitespace from the identifiers', function () {
        translateApiService.add(' yes ');

        expect(translateApiService.getTranslationKeys()).toEqual(['yes']);
    });
});
