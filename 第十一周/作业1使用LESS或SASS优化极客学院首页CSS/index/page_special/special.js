define(function(require, exports, module){
	var $ = require("jquery");
	var html = require("./special.html");
	
	require("reset");
	require("./special.css");
	
	module.exports={
		render:function(target){
			$(target).append(html);
		}	
	};
});