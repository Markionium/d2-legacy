function applyScope(scope, time) {
    return inject(function ($timeout) {
        scope.$apply();
        $timeout.flush(time);
    });
}

function flushTime(time) {
    return inject(function ($timeout) {
        $timeout.flush(time);
    });
}
