/*
 * swigql
 * Copyright (c) 2013 Civitas Learning Inc
 * MIT Licensed
 */

/** @module swigql */

var swig = require('./swig/lib/swig.js');
var helpers = require('./swig/lib/helpers');
var _ = require('underscore');

/* Add a "bind" tag to swig */
var tags = {
	bind: function (indent, parser) {
		var myArg = parser.parseVariable(this.args[0]);
		return helpers.setVar('__myArg', myArg)
		+ 'o = _ext.swigql;'
		+ 'if (! o.argMap.hasOwnProperty(__myArg)) {'
		+ '    o.counter++;'
		+ '    o.argMap[__myArg]     = o.counter;'
		+ '    o.bind[o.counter - 1] = __myArg;'
		+ '}'
		+ '_output += "$" + o.argMap[__myArg];';
	}
};
tags.bind.ends = false; // No need to close the tag, just {% bind var %} will suffice.

// create an extension that can map named-variables to bind variables
var extensions = {
	swigql: {}
};

// configure swig
var config = {
	tags: tags,
	extensions: extensions
};
swig.init(config);

/** wrap swig's init */
exports.init = function (options) {
	var opts = _.extend({}, options, config);
	swig.init(opts);
};

// wrap the render method to return the sql text AND the bind values
var wrap = function (render, source, options) {
	extensions.swigql = { bind: [], argMap: {}, counter: 0 };
	var txt = render.call(undefined, source, options);
	var bind = extensions.swigql.bind;
	return [txt, bind];
};

// inject a new render method onto the template
var inject = function (template) {
	var old = _.bind(template.render, template);
	template.render = _.wrap(old, wrap);
	return template;
};

/** wrap swig's compileFile */
exports.compileFile = _.compose(inject, swig.compileFile);

/** wrap swig's compile */
exports.compile     = _.compose(function (r) { return _.wrap(r, wrap); }, swig.compile);
