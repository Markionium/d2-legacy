beforeEach(function () {
    this.addMatchers({

        toHaveMethod: function(methodName) {
            if (this.actual[methodName] && typeof this.actual[methodName] === 'function') {
                return true;
            }
            return false;
        },

        //TODO: Give some better feedback as it now calls the instance of "Function"
        toBeInstanceOf: function (type) {
            if (this.actual instanceof type) {
                return true;
            }
            return false;
        },

        toHavePrototype: function (wantedPrototype) {
            return wantedPrototype.prototype.isPrototypeOf(this.actual);
        }
    });
})