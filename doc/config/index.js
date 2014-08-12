var _ = require('lodash');
var path = require('canonical-path');
var packagePath = __dirname;

var angularjsPackage = require('d2doc-dgeni-packages/d2doc');
var examplesPackage = require('d2doc-dgeni-packages/examples');

module.exports = function(config) {

  config = angularjsPackage(config);
  config = examplesPackage(config);
  
  config.append('processing.processors', [
    //require('./processors/error-docs'),
    require('./processors/keywords'),
    //require('./processors/versions-data'),
    require('./processors/pages-data'),
    //require('./processors/protractor-generate'),
    require('./processors/index-page')
  ]);

  config.append('processing.tagDefinitions', [
    //require('./tag-defs/tutorial-step')
  ]);

  config.set('processing.search.ignoreWordsFile', path.resolve(packagePath, 'ignore.words'));

  config.prepend('rendering.templateFolders', [
    path.resolve(packagePath, 'templates')
  ]);

  return config;
};
