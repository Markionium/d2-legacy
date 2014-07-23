"use strict";
describe('Service: TypeAhead', function () {
    var typeAheadService, typeAheadValues;

    typeAheadValues = ['Mark', 'Polak', 'Lars', 'Helge', 'Abyot'];

    beforeEach(module('d2-typeahead'));
    beforeEach(inject(function (_d2TypeAheadService_) {
        typeAheadService = _d2TypeAheadService_;
    }));

    it('should add an array to the cache when calling the add method', function () {
        typeAheadService.add('identifier');

        expect(typeAheadService.identifier).toBeDefined();
        expect(typeAheadService.identifier).toBeAnArray();
    });

    it('should add the values provided to add to the cache', function () {
        typeAheadService.add('identifier', typeAheadValues);

        expect(typeAheadService.identifier).toEqual(typeAheadValues);
    });

    it('should push the extra provided values onto the already existing ones', function () {
        var expectedResult = typeAheadValues.concat(['Jane', 'John']);
        typeAheadService.identifier = typeAheadValues;

        typeAheadService.add('identifier', ['Jane', 'John']);

        expect(typeAheadService.identifier).toEqual(expectedResult);
    });

    it('get should return the list when calling get with identifier', function () {
        typeAheadService.identifier = typeAheadValues;

        expect(typeAheadService.get('identifier')).toEqual(typeAheadValues);
    });

    it('get should return an empty array when the identifier does not exist', function () {
        expect(typeAheadService.get('identifier')).toEqual([]);
    });

    it('add should add a shorthand property for getting the values', function () {
        typeAheadService.add('identifier', ['Jane', 'John']);

        expect(typeAheadService.identifier).toEqual(['Jane', 'John']);
    });

    it('should not allow "add" and "get" to be used for identifier names', function () {
        var addFunction = function () {
            typeAheadService.add('add', []);
        }

        expect(addFunction).toThrow('Cannot override add or get methods');
    });

    it('should throw an error when passing a identifier that is not a string', function () {
        var addFunction = function () {
            typeAheadService.add({}, []);
        }

        expect(addFunction).toThrow('Only string identifiers are allowed');
    });

    it('should throw an error when the value passed as a value is not undefined or an array', function () {
        var addFunction = function () {
            typeAheadService.add('identifier', {});
        }

        expect(addFunction).toThrow('Values should be an array');
    });

    it('should only contain unique strings', function () {
        typeAheadService.add('identifier', typeAheadValues);
        typeAheadService.add('identifier', typeAheadValues);

        expect(typeAheadService.identifier).toEqual(typeAheadValues);
    });
});