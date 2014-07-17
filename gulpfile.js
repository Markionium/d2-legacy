var gulp = require('gulp');
var bower = require('bower');
var karma = require('gulp-karma');

//var files = [
//    src_base + 'vendor/jquery/jquery.js',
//    src_base + 'vendor/angular/angular.js',
//    src_base + 'vendor/angular-*/angular-*.js',
//    src_base + 'vendor/ng-table/ng-table.js',
//    src_base + 'vendor/lodash/dist/lodash.js',
//    src_base + 'vendor/restangular/dist/restangular.js',
//
//    src_base + 'app.js',
//    src_base + 'components/**/*.js',
//    test_base + 'phantomjs-*.js',    // Phantom js feature fixes
//    test_base + 'matchers/*.js',    // Jasmine additional matchers
//    test_base + 'mocks/*.js',
//    test_base + 'fixtures/**/*.js',
//    test_base + 'specs/**/*_spec.js',
//    src_base + 'components/**/*.html'
//];

var files = [
    //Vendor
    'test/vendor/jquery/jquery.js',
    'test/vendor/angular/angular.js',
    'test/vendor/angular-mocks/angular-mocks.js',

    'test/vendor/lodash/dist/lodash.js',

    'test/vendor/restangular/dist/restangular.js',

    // Source files
    'src/**/*.js',
    'src/**/*.html',

    // Test related
    'test/utils/phantomjs-bind-fix.js',
    'test/matchers/**/*.js',
    'test/fixtures/**/*.js',
    'test/spec/**/*.js',
];

var karma_config = 'test/karma.conf.js'

gulp.task('bower', function() {
    return bower.commands.install();
});

gulp.task('test', ['bower'], function() {
    return gulp.src(files)
        .pipe(karma({
            configFile: karma_config,
            action: 'run'
        }))
        .on('error', function( err ) {
            throw err;
        });
});

gulp.task('watch', function() {
    gulp.src(files)
        .pipe(karma({
            configFile: karma_config,
            action: 'watch'
        }));
});
