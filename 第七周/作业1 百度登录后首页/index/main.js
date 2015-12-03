define(function(require, exports, module) {
	console.log("this main function");
	var page_top_bar = require("./page_top_bar/page_top_bar");
	var theme = require("theme");
	page_top_bar.render("#page_top_bar");
	theme.render("#tool_theme");
	theme.target("body");
});