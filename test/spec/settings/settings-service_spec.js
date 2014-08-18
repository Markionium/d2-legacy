describe('Settings service', function () {
    var systemSettingsService,
        $httpBackend;

    beforeEach(module('d2-settings'));
    beforeEach(inject(function (_systemSettingsService_, _$httpBackend_) {
        systemSettingsService = _systemSettingsService_;
        $httpBackend = _$httpBackend_;

        $httpBackend.expectGET('/dhis/api/systemSettings').respond(200, fixtures.api.settings.all);
    }));

    it('should have the system settings loaded', function () {
        expect(systemSettingsService).toBeDefined();
    });

    it('should add all the system settings to the service', function () {
        $httpBackend.flush();

        expect(systemSettingsService.getAll()).toEqual(fixtures.api.settings.all);
    });

    it('should have a getAll function', function () {
        expect(systemSettingsService.getAll).toBeDefined();
    });

    it('should return all settings when calling getAll', function () {
        $httpBackend.flush();

        expect(systemSettingsService.getAll()).toEqual(fixtures.api.settings.all);
    });

    it('should have a get function', function () {
        expect(systemSettingsService.get).toBeDefined();
    });

    it('should return a single setting when calling the get function', function () {
        $httpBackend.flush();

        expect(systemSettingsService.get('keyFlag')).toBe('dhis2');
    });
});
