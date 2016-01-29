define(function(require, exports, module){
	var $ = require("jquery");
	var html = require("./knowledge.html");
	
	require("reset");
	require("./knowledge.css");
	
	module.exports={
		render:function(target){
			$(target).append(html);
		}
	};
	
});