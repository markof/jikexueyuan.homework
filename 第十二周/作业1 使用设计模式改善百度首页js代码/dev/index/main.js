define(function(require, exports, module) {
    
    /**
     * 使用的设计模式：外观模式，工厂
     * 对于index页面来说，是一个整体，由很多模块组成。这些模块的创建，则使用工厂模式进行创建。
     * 但是对于index来说不建议理解各个模块内部的运行机制，如果index理解各个模块的机制，那么就增加了index的负担，
     * 且如果且组成index的模块有增加或者变化时，index需要处理的内容太多，不利于index页面的维护。
     * 因此对于各个模块，index只要负责让各个模块在指定的位置渲染即可。对于内部的事件绑定，用户逻辑无需理解。
     * 而无需index理解的逻辑均封装为render接口。
     */
    
    
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