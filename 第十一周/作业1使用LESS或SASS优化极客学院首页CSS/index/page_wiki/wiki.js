define(function(require, exports, module){
	var $ = require("jquery");
	var html = require("./wiki.html");
	
	require("reset");	
	require("./wiki.css");
	
	module.exports={
		render:function(target){
			$(target).append(html);
		}
	};
});