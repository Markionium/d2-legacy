"use strict";

//General
var gulp = require('gulp');
var concat = require('gulp-concat');
var bower = require('bower');
var connect = require('gulp-connect');

//Docs
var dgeni = require('dgeni');
var merge = require('event-stream').merge;
var path = require('canonical-path');
var historyApiFallback = require('connect-history-api-fallback');

// We indicate to gulp that tasks are async by returning the stream.
// Gulp can then wait for the stream to close before starting dependent tasks.
// See clean and bower for async tasks, and see assets and doc-gen for dependent tasks below

var outputFolder = 'doc/build/docs';
var bowerFolder = './bower_components';

var copyComponent = function(component, pattern, sourceFolder, packageFile) {
    pattern = pattern || '/**/*';
    sourceFolder = sourceFolder || bowerFolder;
    packageFile = packageFile || 'bower.json';
    var version = require(path.resolve(sourceFolder,component,packageFile)).version;
    return gulp
        .src(sourceFolder + '/' + component + pattern)
        .pipe(gulp.dest(outputFolder + '/components/' + component + '-' + version));
};

/***********************************************************************************************************************
 * General tasks
 **********************************************************************************************************************/

gulp.task('bower', function() {
    return bower.commands.install();
});

/***********************************************************************************************************************
 * Documentation tasks
 **********************************************************************************************************************/

gulp.task('doc-build-app', function() {
    gulp.src('app/src/**/*.js')
        .pipe(concat('docs.js'))
        .pipe(gulp.dest(outputFolder + '/js/'));
});

gulp.task('doc-assets', ['bower'], function() {
    return merge(
        gulp.src(['app/assets/**/*']).pipe(gulp.dest(outputFolder)),
        copyComponent('bootstrap', '/dist/**/*'),
        copyComponent('open-sans-fontface'),
        copyComponent('lunr.js','/*.js'),
        copyComponent('google-code-prettify'),
        copyComponent('jquery', '/jquery.*'),
        copyComponent('marked', '/**/*.js', undefined, 'package.json'),

        copyComponent('angular', '/**/*.js'),
        copyComponent('angular-route', '/**/*.js'),
        copyComponent('angular-resource', '/**/*.js'),
        copyComponent('angular-cookies', '/**/*.js'),
        copyComponent('angular-sanitize', '/**/*.js'),
        copyComponent('angular-touch', '/**/*.js'),
        copyComponent('angular-animate', '/**/*.js')
    );
});


gulp.task('doc-gen', function() {
    var generateDocs = dgeni.generator('dgeni.conf.js');
    return generateDocs()
        .catch(function(error) {
            process.exit(1);
        });
});

// The default task that will be run if no task is supplied
gulp.task('default', ['doc-assets', 'doc-gen', 'doc-build-app']);

// Run the doc server
gulp.task('server', function() {
    var server = connect.server({
        root: 'build/docs/',
        port: 8000,
        middleware: function (connect, opt) {
            return [historyApiFallback];
        }
    });

    return server;
});
