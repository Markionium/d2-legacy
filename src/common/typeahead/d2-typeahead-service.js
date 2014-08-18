/**
 * @ngdoc service
 * @name typeAheadService
 *
 * @description
 *
 * The typeahead services lets you store and retrieve typeahead values that can be used
 * by angular ui's typeahead functionality.
 *
 * This service was created to easily keep track of typeahead values for REST searchable tables.
 * The typeahead service keeps new names that are added to it.
 *
 * This is used for example in the {@link d2-recordtable#recordTable} directive. When searching fields that are loaded
 * by a rest service. When searching and new values get pulled in these get added to the typeahead service.
 */
angular.module('d2-typeahead').service('typeAheadService', function () {
    /**
     * @ngdoc method
     * @name typeAheadService#add
     *
     * @param {String} id The identifier of what typeahead these values belong to.
     * @param {Array=} [values] The values that should be added to the typeahead for the given id.
     *
     * @description
     *
     * Allows you to add values to the typeAheadService. When the method is called with an identifier only
     * it will create an empty values list.
     *
     * Whenever a list for the given identifier already exists it will append the
     * new given values to the already existing list of values.
     *
     * throws {Error} Only string identifiers are allowed
     * throws {Error} Cannot override add or get methods
     * throws {Error} Values should be an array
     */
    this.add = function (id, values) {
        if (!angular.isString(id)) {
            throw 'Only string identifiers are allowed';
        }
        if (id === 'get' || id === 'add') {
            throw 'Cannot override add or get methods';
        }
        if (values !== undefined && !angular.isArray(values)) {
            throw 'Values should be an array';
        }

        this[id] = _.uniq((this[id] || []).concat(values));
    };

    /**
     * @ngdoc method
     * @name typeAheadService#get
     *
     * @param {String} id The identifier of the typeAhead value list to retrieve
     * @returns {Array}
     *
     * @description
     *
     * Returns the values of for the given identifier.
     *
     * {@note When the identifier does not exist
     * And empty list will be returned. }
     */
    this.get = function (id) {
        return this[id] || [];
    };
});
