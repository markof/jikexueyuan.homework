define(function(require, exports, module){
	
	var pageContainer = undefined;
	
	// 引入必要模块，并做初始化。
	var html = require("./page_footer.html");
	require("reset-css");
	require("./page_footer.css");
	
	module.exports = {		
		render:function(container){
			pageContainer = $(container);
			pageContainer.append(html);
		}
	}
});