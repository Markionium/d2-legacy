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

//TODO: Some of the test below might be redundant with the ones above.
describe('Config: apiConfig', function () {
    var apiConfig;

    beforeEach(module('d2-config'));
    beforeEach(inject(function (_apiConfig_) {
        apiConfig = _apiConfig_;
    }));

    it('should be an object', function () {
        expect(apiConfig).toBeAnObject();
    });

    describe('getUrl', function () {
        it('should be a method on the apiConfig object', function () {
            expect(apiConfig.getUrl).toBeAFunction();
        });

        it('should throw an error when the passed resource is not a string', function () {
            function shouldThrow() {
                apiConfig.getUrl([]);
            }
            expect(shouldThrow).toThrow('Api Config Error: Resource URL should be a string');
        });

        it('should prefix the resource with the API_ENDPOINT prefix', function () {
            expect(apiConfig.getUrl('myEndPoint')).toBe('/dhis/api/myEndPoint');
        });

        it('should strip the leading slash form the path before creating the resource', function () {
            expect(apiConfig.getUrl('/myEndPoint')).toBe('/dhis/api/myEndPoint');
        });
    });
});

describe('Config: apiConfig with a configured API_ENDPOINT', function () {
    var apiConfig;

    beforeEach(module('d2-config'));
    beforeEach(module(function($provide) {
        $provide.constant('API_ENDPOINT', '/myCustomApiLocation');
    }));
    beforeEach(inject(function (_apiConfig_) {
        apiConfig = _apiConfig_;
    }));

    it('should use the custom prefix when creating the endpoint', function () {
        expect(apiConfig.getUrl('myEndPoint')).toBe('/myCustomApiLocation/myEndPoint');
    });
});
