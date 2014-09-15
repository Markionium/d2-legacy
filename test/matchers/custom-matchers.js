beforeEach(function () {
    this.addMatchers({

        toHaveMethod: function(methodName) {
            if (this.actual[methodName] && typeof this.actual[methodName] === 'function') {
                return true;
            }
            this.message = function () {
                return 'Expected ' + this.actual + ' to have a method called ' + methodName;
            }
            return false;
        },

        //TODO: Is not used anymore, see if we still want to keep this.
        toHavePrototype: function (wantedPrototype) {
            return wantedPrototype.prototype.isPrototypeOf(this.actual);
        },

        toHaveBeenCalledOnce: function () {
            if (!jasmine.isSpy(this.actual)) {
                throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
            }

            if (this.actual.callCount === 1) {
                return true;
            }

            this.message = function () {
                return 'Expected ' + this.actual.methodName +  ' to have been called ' +
                    'once and only once. (it was called ' + this.actual.callCount + ' times).';
            };
            return false;
        },

        toHaveCallCount: function (callCount) {
            if (!jasmine.isSpy(this.actual)) {
                throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
            }

            if (this.actual.callCount === callCount) {
                return true;
            }

            this.message = function () {
                return 'Expected ' + this.actual.methodName + ' to have been called ' + callCount +
                    ' times. Instead it was called ' + this.actual.callCount + ' times.';
            }
            return false;
        },

        toBeAnObject: function () {
            this.message = function () {
                return 'Expected ' + this.actual + ' to be an object';
            }
            return angular.isObject(this.actual);
        },

        toBeAnArray: function () {
            this.message = function () {
                return 'Expected ' + this.actual + ' to be an array';
            }
            return angular.isArray(this.actual);
        },

        toBeAFunction: function () {
            var result = angular.isFunction(this.actual);

            this.message = function () {
                return 'Expected ' + this.actual + (result ? ' NOT' : '') + ' to be an function';
            }
            return result;
        },

        toHaveClass: function (className) {
            var result = this.actual.hasClass(className);

            this.message = function () {
                if (this.actual.length > 0) {
                    return 'Expected ' + this.actual + (result ? ' NOT' : '') + ' to have class "' + className + '"';
                } else {
                    return 'Expected some elements to have class "' + className + '" but no elements were found.';
                }
            };

            return result;
        }
    });
});
