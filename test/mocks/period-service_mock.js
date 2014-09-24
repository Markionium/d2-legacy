function periodServiceMock() {
    var periodTypes = [
        "Daily",
        "Weekly",
        "Monthly",
        "BiMonthly",
        "Quarterly",
        "SixMonthly",
        "SixMonthlyApril",
        "Yearly",
        "FinancialApril",
        "FinancialJuly",
        "FinancialOct"
    ];
    var periodValues = [
        'September 2014',
        'October 2014',
        'November 2014',
        'December 2014'
    ];


    return {

        getPeriodTypes: function () {
            return periodTypes;
        },

        getPastPeriodsRecentFirst: function () {
            return periodValues;
        }
    }
}