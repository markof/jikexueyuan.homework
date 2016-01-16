define(function(require, exports, module){
	
	var pageContainer = undefined;
	
	// 引入必要模块，并做初始化。
	var html = require("./card_my.html");
	require("reset-css");
	require("./card_my.css");
	
	module.exports = {		
		render:function(container){
			pageContainer = $(container);
			pageContainer.append(html);	
			$("#card-my .horoscope .horoscope-nav .nav-item").on("click",showHoroscope);
		}
	};
	
	function showHoroscope(){
		$("#card-my .horoscope .horoscope-nav .nav-item").removeClass("active");
		$(this).addClass("active");
		var horoscope = $(this).attr("data-name");
		$("#card-my .horoscope .horoscope-content").hide();
		$("#horoscope-"+horoscope).show();
	}
})