describe('Config: API_ENDPOINT', function () {
    var API_ENDPOINT;
    beforeEach(module('d2-config'));
    beforeEach(inject(function (_API_ENDPOINT_) {
        API_ENDPOINT = _API_ENDPOINT_;
    }));

    it('should have a constant for API_ENDPOINT', function () {
        expect(API_ENDPOINT).toBeDefined();
    });

    it('should have the default value set to /dhis/api', function () {
        expect(API_ENDPOINT).toBe('/dhis/api')
    });
});
