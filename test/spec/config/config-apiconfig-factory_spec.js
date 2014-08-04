describe('Config: ApiConfig default', function () {
    var apiConfig;

    beforeEach(module('d2-config', function ($provide) {
        $provide.constant('API_ENDPOINT', '/dhis/api');
    }));
    beforeEach(inject(function (_apiConfig_) {
        apiConfig = _apiConfig_;
    }));

    it('should have a getUrl method', function () {
        expect(apiConfig).toHaveMethod('getUrl');
    });

    it('should return the correct url when passing a resource', function () {
        expect(apiConfig.getUrl('i18n')).toBe('/dhis/api/i18n');
    });

    it('should return the correct url on a more complicated resource', function () {
        expect(apiConfig.getUrl('me/authorities')).toBe('/dhis/api/me/authorities');
    });

    it('should throw an error when the resource is not a string', function () {
        function resourceThatIsNotAString() {
            apiConfig.getUrl();
        }
        expect(resourceThatIsNotAString).toThrow('Api Config Error: Resource URL should be a string');
    });
});

describe('Config: ApiConfig changed config', function () {
    beforeEach(module('d2-config', function ($provide) {
        $provide.constant('API_ENDPOINT', 'dhis2/api');
    }));

    beforeEach(inject(function (_apiConfig_) {
        apiConfig = _apiConfig_;
    }));

    it('should return the correct route for the changed endpoint', function () {
        expect(apiConfig.getUrl('i18n')).toBe('dhis2/api/i18n');
    });
});