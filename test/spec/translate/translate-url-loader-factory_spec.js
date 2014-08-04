describe('Translate loader', function () {
    var d2LanguageLoader;

    beforeEach(module('d2-translate', function ($translateProvider) {
        //Set a translation language so it does not do the http request
        $translateProvider.translations('en', {});
    }));

    beforeEach(inject(function (_d2LanguageLoader_, _$httpBackend_) {
        d2LanguageLoader = _d2LanguageLoader_;
        $httpBackend = _$httpBackend_;

        $httpBackend.expectGET('common/i18n/en.json').respond({"yes": "Oui"});
    }));

    afterEach(inject(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should call the static file for the asked language', function () {
        d2LanguageLoader({key: 'en'});
        $httpBackend.flush();
    });
    
    it('should ask the translateApi for a list of translation keys', inject(function (translateApi) {
        spyOn(translateApi, 'getTranslationKeys').andReturn([]);

        d2LanguageLoader({key: 'en'});
        $httpBackend.flush();

        expect(translateApi.getTranslationKeys).toHaveBeenCalledOnce();
    }));

    it('should not call the static loader twice for the same key', function () {
        d2LanguageLoader({key: 'en'});
        $httpBackend.flush();
        d2LanguageLoader({key: 'en'});

        //TODO: a bit of a weird assertion perhaps.
        expect($httpBackend.flush).toThrow('No pending request to flush !');
    });

    it('should return the same data after calling the loader twice for the same key', inject(function ($rootScope) {
        var firstLoad, secondLoad;

        d2LanguageLoader({key: 'en'}).then(function (data) {
            firstLoad = data;
        });
        $httpBackend.flush();
        d2LanguageLoader({key: 'en'}).then(function (data) {
            secondLoad = data;
        });

        $rootScope.$apply();

        expect(firstLoad).toEqual(secondLoad);
    }));

    it('should call the i18n api endpoint when there are keys in the translateApi', inject(function (translateApi) {
        $httpBackend.expectPOST('/dhis/api/i18n', ["no"]).respond(200, {"no": "No"});

        translateApi.add('no');
        d2LanguageLoader({key: 'en'});
        $httpBackend.flush();
    }));

    it('should add the extra returned keys to result from the loader', inject(function (translateApi) {
        var translations;
        $httpBackend.expectPOST('/dhis/api/i18n', ["no"]).respond(200, {"no": "No"});

        translateApi.add('no');
        d2LanguageLoader({key: 'en'}).then(function (data) {
            translations = data;
        });
        $httpBackend.flush();

        expect(translations).toEqual({yes: "Oui", no: "No"})
    }));
});
