beforeEach(function () {
    var bench = window.bench || {
        currentSuite: undefined,
        benchMark: true,
        slowOnly: true,
        slowThreshold: 100,
        testTimeStart: Date.now(),
        benchTest: function (test) {
            var diff = Date.now() - this.testTimeStart,
                message;

            if (diff > this.slowThreshold) {
                message = "\x1B[91m" + diff;
            } else {
                message = "\x1B[92m" + diff;
            }

            if (this.slowOnly) {
                if (diff > this.slowThreshold) {
                    console.log("\x1B[90m" + test.suite.description + ": \x1B[96m" + test.description + ": " + message);
                }
            } else {
                if (this.currentSuite !== test.suite.description) {
                    this.currentSuite = test.suite.description;
                    console.log('');
                    console.log("\x1B[90m" + this.currentSuite + ": ");
                }
                console.log("\t  " + test.description + ": " + message);
            }

        }
    };
    bench.testTimeStart = Date.now();
    window.bench = bench;
});

afterEach(function () {
    if (window.bench.benchMark) {
        window.bench.benchTest(this);
    }
});
