define(function(require, exports, module) {
	// 引入必要的模块
	var page_top_bar = require("./page_top_bar/page_top_bar");
	var theme = require("theme");
	var searchbar = require("searchbar");
	var maincard = require("maincard");
	var footer = require("footer");
	
	// 调用各个模块的渲染接口
	page_top_bar.render("#page_top_bar");
	theme.render("#tool_theme", "body");
	searchbar.render("#page_search_bar");
	maincard.render("#page_main_card");
	footer.render("#page_footer");
	
	theme.updateTheme();
});