//// @dgeni developers: Why do we need canonical-path?
//var path = require('canonical-path');
//
//
//module.exports = function(config) {
//  // Use jsdocPackage
//  require('dgeni-packages/d2doc')(config);
//
//  // And the nunjucks template renderer
//  //require('dgeni-packages/nunjucks')(config);
//
//  // Set logging level
//  config.set('logging.level', 'debug');
//
//  // Add your own templates to render docs
//  config.prepend('rendering.templateFolders', [
//    path.resolve(__dirname, 'templates')
//  ]);
//
//  // You can specifiy which tempate should be used based on a pattern.
//  // Currently we just use one template and don't need a pattern
//  /*config.prepend('rendering.templatePatterns', [
//    'common.template.html'
//  ]);*/
//
//  // This tells dgeni where to look for stuff
//  config.set('source.projectPath', '.');
//
//  config.set('source.files', [
//    {
//      // Process all js files in src/.
//      pattern: '**/*.js',
//      // Some processors use the relative path of the source file to compute properties, such as
//      // the outputPath. The basePath allows us to ensure that the "relative" path to each source
//      // file is accurate no matter where the source files are relative to the projectPath.
//      basePath: path.resolve(__dirname, '../dhis-web-upkeep/src/main/components')
//    }
//  ]);
//
//  // Our generated docs will be written here:
//  config.set('rendering.outputFolder', './build/');
//  // The contentsFolder is the path relative to the outputFolder, which identifies the place where
//  // the "standard" content files are stored.  For example, in the AngularJS application, the output
//  // folder is `build/docs` but the way that the application is stored, means that we want the
//  // content files (i.e. the files that contain the content of each "doc") to be stored in
//  // `build/docs/partials`
//  config.set('rendering.contentsFolder', 'docs');
//
//  return config;
//};

var path = require('canonical-path');
var basePath = __dirname;

var basePackage = require('./config');

module.exports = function(config) {

    var version = '0.1.1'; //TODO: Get the version dynamically
    var cdnUrl = "//d2.dhis2.org/" + version.cdn;

    var getVersion = function(component, sourceFolder, packageFile) {
        sourceFolder = sourceFolder || './bower_components';
        packageFile = packageFile || 'bower.json';
        return require(path.resolve(sourceFolder,component,packageFile)).version;
    };


    config = basePackage(config);
    config.set('source.projectPath', path.resolve(basePath, '.'));
    console.log(path.resolve(basePath, 'content'));
    config.set('source.files', [
        { pattern: '**/*.js', basePath: path.resolve(basePath, '../../dhis-web-upkeep/src/main/components') },
        { pattern: '**/*.ngdoc', basePath: path.resolve(basePath, 'content') }
    ]);
    /*
    config.set('processing.examples.commonFiles', {
        scripts: [ '../../../angular.js' ],
        stylesheets: []
    });

    config.set('processing.examples.dependencyPath', '.');
    */
    config.set('rendering.outputFolder', basePath + '/build/docs');

    config.set('logging.level', 'info');

    config.merge('deployment', {
        environments: [{
            name: 'debug',
            scripts: [
                '../angular.js',
                '../angular-resource.js',
                '../angular-route.js',
                '../angular-cookies.js',
                '../angular-sanitize.js',
                '../angular-touch.js',
                '../angular-animate.js',
                'components/marked-' + getVersion('marked', undefined, 'package.json') + '/lib/marked.js',
                'js/angular-bootstrap/bootstrap.js',
                'js/angular-bootstrap/bootstrap-prettify.js',
                'js/angular-bootstrap/dropdown-toggle.js',
                'components/lunr.js-' + getVersion('lunr.js') + '/lunr.js',
                'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
                'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
                'js/pages-data.js',
                'js/docs.js'
            ],
            stylesheets: [
                'components/bootstrap-' + getVersion('bootstrap') + '/dist/css/bootstrap.css',
                'components/open-sans-fontface-' + getVersion('open-sans-fontface') + '/open-sans.css',
                'css/prettify-theme.css',
                'css/docs.css',
                'css/animations.css'
            ]
        },
            {
                name: 'default',
                scripts: [
                    'components/angular-' + getVersion('angular') + '/angular.js',
                    'components/angular-route-' + getVersion('angular-route') + '/angular-route.js',
                    'components/angular-resource-' + getVersion('angular-resource') + '/angular-resource.js',
                    'components/angular-cookies-' + getVersion('angular-cookies') + '/angular-cookies.js',
                    'components/angular-sanitize-' + getVersion('angular-sanitize') + '/angular-sanitize.js',
                    'components/angular-touch-' + getVersion('angular-touch') + '/angular-touch.js',
                    'components/angular-animate-' + getVersion('angular-animate') + '/angular-animate.js',

                    'components/marked-' + getVersion('marked', undefined, 'package.json') + '/lib/marked.js',
                    'js/angular-bootstrap/bootstrap.js',
                    'js/angular-bootstrap/bootstrap-prettify.js',
                    'js/angular-bootstrap/dropdown-toggle.js',
                    'components/lunr.js-' + getVersion('lunr.js') + '/lunr.min.js',
                    'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
                    'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
                    'js/pages-data.js',
                    'js/docs.js'
                ],
                stylesheets: [
                    'components/bootstrap-' + getVersion('bootstrap') + '/css/bootstrap.min.css',
                    'components/open-sans-fontface-' + getVersion('open-sans-fontface') + '/open-sans.css',
                    'css/prettify-theme.css',
                    'css/docs.css',
                    'css/animations.css'
                ]
            },
            {
                name: 'production',
                scripts: [
                    cdnUrl + '/angular.min.js',
                    cdnUrl + '/angular-resource.min.js',
                    cdnUrl + '/angular-route.min.js',
                    cdnUrl + '/angular-cookies.min.js',
                    cdnUrl + '/angular-sanitize.min.js',
                    cdnUrl + '/angular-touch.min.js',
                    cdnUrl + '/angular-animate.min.js',
                    'components/marked-' + getVersion('marked', undefined, 'package.json') + '/lib/marked.js',
                    'js/angular-bootstrap/bootstrap.js',
                    'js/angular-bootstrap/bootstrap-prettify.js',
                    'js/angular-bootstrap/dropdown-toggle.js',
                    'components/lunr.js-' + getVersion('lunr.js') + '/lunr.min.js',
                    'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/prettify.js',
                    'components/google-code-prettify-' + getVersion('google-code-prettify') + '/src/lang-css.js',
                    'js/pages-data.js',
                    'js/docs.js'
                ],
                stylesheets: [
                    'components/bootstrap-' + getVersion('bootstrap') + '/dist/css/bootstrap.min.css',
                    'components/open-sans-fontface-' + getVersion('open-sans-fontface') + '/open-sans.css',
                    'css/prettify-theme.css',
                    'css/docs.css',
                    'css/animations.css'
                ]
            }
        ]
    });

    config.set('rendering.contentsFolder', 'docs');

    return config;
};
