/*
 * fis
 * http://fis.baidu.com/
 */

'use strict';

var minify = require('html-minifier').minify;

module.exports = function(content, file, conf){
    return minify(content, conf);
};

module.exports.defaultOptions = {
//    removeComments:                true,
//    removeCommentsFromCDATA:       true,
//    removeCDATASectionsFromCDATA:  true,
//    collapseBooleanAttributes:     true,
//    removeRedundantAttributes:     true,
//    removeEmptyElements:           true,
//    removeOptionalTags:            true,
//    removeAttributeQuotes:         true,
//    useShortDoctype:               true,
//    removeEmptyAttributes:         true,
//    removeScriptTypeAttributes:    true,
//    removeStyleLinkTypeAttributes: true,
    collapseWhitespace:            true
};
