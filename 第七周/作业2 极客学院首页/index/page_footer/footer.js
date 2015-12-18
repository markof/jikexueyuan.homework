define(function(require, exports, module){
	var $ = require("jquery");
	var html = require("./footer.html");
	
	require("reset");
	require("./footer.css");
	
	module.exports = {
		render:function(target){
			$(target).append(html);
		}
	};
	
});