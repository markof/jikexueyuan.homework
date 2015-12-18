define(function(require, exports, module){
	var $  = require("jquery");
	var html = require("./career.html");
	
	require("reset");
	require("./career.css");
	
	module.exports = {
		render : function(target){
			$(target).append(html);		
		}
	};
});