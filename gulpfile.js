"use strict";
/*
 * Copyright (c) 2004-2014, University of Oslo
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * Neither the name of the HISP project nor the names of its contributors may
 * be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
/**
 * Created by Mark Polak on 17 Jul 2014.
 */

var gulp = require('gulp');
var bower = require('bower');
var karma = require('gulp-karma');

var clean = require('gulp-clean');
var sass = require('gulp-ruby-sass');
var runSequence = require('run-sequence');

var ngannotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');

var wrap = require('gulp-wrap');

var jshint = require('gulp-jshint');

/***********************************************************************************************************************
 * Settings
 **********************************************************************************************************************/

var destFold = "dev";
var benchMarkTests = true;

var files = [
    //Vendor
    'test/vendor/jquery/jquery.js',
    'test/vendor/lodash/dist/lodash.js',

    'test/vendor/angular/angular.js',
    'test/vendor/angular-mocks/angular-mocks.js',

    'test/vendor/restangular/dist/restangular.js',
    'test/vendor/angular-translate/angular-translate.js',
    'test/vendor/angular-bootstrap/ui-bootstrap-tpls.js',

    // Source files
    'src/**/*.js',
    'src/**/*.html',

    // Test related
    'test/utils/phantomjs-bind-fix.js',
    'test/utils/testing.js',
    'test/matchers/**/*.js',
    'test/fixtures/**/*.js',
    'test/spec/**/*.js'
];

if (benchMarkTests) {
    files = files.concat(['test/utils/bench.js']);
}

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

/***********************************************************************************************************************
 * Build
 **********************************************************************************************************************/

gulp.task('clean', function() {
    return gulp.src(destFold).pipe(clean({force: true}));
});

//TODO: Add css minifier option
gulp.task('make-css', function () {
    return gulp.src('./src/common/**/*.sass')
        .pipe(sass({sourcemap: true, sourcemapPath: 'https://raw.githubusercontent.com/Markionium/d2/master/src/common'}))
        .pipe(gulp.dest(destFold + '/css'));
});

//TODO: min-js and src-js can probably be optimized so we do a few of the steps only once and pipe the result?
gulp.task('src-js', function () {
    return gulp.src('./src/common/**/*.js')
        .pipe(ngannotate())
        .pipe(concat('d2.js'))
        .pipe(wrap({ src: './src/common/d2.wrap' }))
        .pipe(gulp.dest(destFold + '/js'))
});

gulp.task('min-js', function () {
    return gulp.src('./src/common/**/*.js')
        .pipe(ngannotate())
        .pipe(uglify())
        .pipe(concat('d2.min.js'))
        .pipe(wrap({ src: './src/common/d2.wrap' }))
        .pipe(gulp.dest(destFold + '/js'));
});

gulp.task('make-js', function () {
    runSequence(['min-js', 'src-js']);
});

gulp.task('templates', function () {
   return gulp.src('./src/common/**/*.html')
       .pipe(gulp.dest(destFold + '/js/common'));
});

gulp.task('lint', function () {
    return gulp.src('./src/common/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

/***********************************************************************************************************************
 * Dev
 */
gulp.task('build', function () {
    destFold = 'dev';
    runSequence('lint', 'clean', ['make-css', 'src-js', 'templates']);
});

/***********************************************************************************************************************
 * Production
 */
gulp.task('build-prod', function () {
    destFold = 'dist';
    runSequence('test', 'lint', 'clean', ['make-css', 'make-js', 'templates']);
});
