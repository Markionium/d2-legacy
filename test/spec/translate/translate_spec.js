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

describe('Translate directive', function () {
    var scope,
        element,
        $compile,
        $timeout,
        returnedTranslations = {"yes":"Yep"};

    beforeEach(module('d2-translate', function ($provide, $translateProvider) {
        $translateProvider.translations('en', returnedTranslations);
    }));

    beforeEach(inject(function ($rootScope, _$compile_, _$httpBackend_, _$timeout_) {
        $compile = _$compile_;
        $httpBackend = _$httpBackend_;
        $timeout = _$timeout_;

        scope = $rootScope.$new();

        element = angular.element('<div translate>yes</div>');
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should translate known strings', function () {
        $compile(element)(scope);
        scope.$apply();
        expect(element.text()).toBe('Yep');
    });

    it('should translate unknown strings through the api', function () {
        $httpBackend.when('GET', 'common/i18n/en.json').respond(200, returnedTranslations);
        $httpBackend.expectPOST('/dhis/api/i18n', ['no']).respond(200, { "no": "Nope" });

        element = angular.element('<div translate>no</div>');
        $compile(element)(scope);

        scope.$apply();
        $timeout.flush(101);
        $httpBackend.flush();

        expect(element.text()).toBe('Nope');
    });

    it('should only call the api loader once every 300ms', function () {
        var elementOne, elementTwo, elementThree, elementFour,
            translations = {
                "one": "1",
                "two": "2",
                "three": "3",
                "four": "4"
            };

        $httpBackend.when('GET', 'common/i18n/en.json').respond(200, returnedTranslations);
        $httpBackend.expectPOST('/dhis/api/i18n', ['one', 'two', 'three', 'four']).respond(200, translations);

        elementOne = angular.element('<div translate>one</div>');
        elementTwo = angular.element('<div translate>two</div>');
        elementThree = angular.element('<div translate>three</div>');
        elementFour = angular.element('<div translate>four</div>');

        $compile(elementOne)(scope);

        $compile(elementTwo)(scope);

        $compile(elementThree)(scope);

        $compile(elementFour)(scope);

        scope.$apply();
        $timeout.flush(101);
        scope.$apply();
        $httpBackend.flush();
    });
});
