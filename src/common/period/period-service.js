//FIXME: the service is not consistent with getters and setters
function periodService(d2Api) {
    var service = this;

    var currentPeriodType;
    var currentPeriod;
    var generatedPeriods;
    var calendarType;
    var dateFormat = 'yyyy-mm-dd';
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
    var periodBaseList = periodTypes;

    var calendarTypes = [
        'coptic',
        'ethiopian',
        'islamic',
        'julian',
        'nepali',
        'thai'
    ];

    Object.defineProperties(this, {
        period: {
            get: function () { return currentPeriod; },
            set: function (period) { currentPeriod = period; }
        },
        periodType: {
            get: function () { return currentPeriodType; }
        }
    });

    this.prepareCalendar = function () {
        var calendar = $.calendars.instance(service.getCalendarType());
        dhis2.period.generator = new dhis2.period.PeriodGenerator(calendar, this.getDateFormat());
    }

    this.getDateFormat = function () {
        return dateFormat;
    };

    this.getPeriodTypes = function () {
        return periodTypes;
    };

    this.getCalendarTypes = function () {
        return calendarTypes;
    };

    this.getCalendarType = function () {
        return calendarType;
    };

    this.getPastPeriodsRecentFirst = function () {
        return generatedPeriods;
    };

    this.setPeriodType = function (periodType) {
        var periods;
        if (_(periodTypes).contains(periodType)) {
            currentPeriodType = periodType;
            periods = dhis2.period.generator.generateReversedPeriods(currentPeriodType, 0);
            generatedPeriods =  dhis2.period.generator.filterFuturePeriodsExceptCurrent(periods);
        }
    };

    this.loadCalendarScript = function (calendarType) {
        jQuery.getScript('../dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.' + calendarType + '.min.js',
            function () {
                service.prepareCalendar();
            }).error(function () {
                throw new Error('Unable to load ' + calendarType + ' calendar');
            });

    };

    this.filterPeriodTypes = function (dataSetPeriodTypes) {
        var firstPeriodIndex = _(periodBaseList).findLastIndex(function (periodType) {
            return _(dataSetPeriodTypes).contains(periodType);
        });
        periodTypes = _.rest(periodBaseList, firstPeriodIndex);
        return periodTypes;
    };

    d2Api.addEndPoint('system/info', true);
    d2Api.getEndPoint('system/info').get().then(function (info) {
        dateFormat = info.dateFormat;

        if (info.calendar === 'iso8601') {
            calendarType = 'gregorian';
            service.prepareCalendar();
        } else {
            calendarType = info.calendar;

            if (_(calendarTypes).contains(calendarType)) {
                service.loadCalendarScript(calendarType);
            }
        }
    });
}

angular.module('d2-period').service('periodService', periodService);
