define(function(require, exports, module){
	
	var pageContainer = undefined;
	
	// 引入必要模块，并做初始化。
	var html = require("./page_search_bar.html");
	var theme = require("theme");
	require("reset-css");
	require("./page_search_bar.css");
	
	module.exports = {		
		render:function(container){
			pageContainer = $(container);
			pageContainer.append(html);	
			
			theme.addNoThemeObserver(function(){
				$("#page_search_bar .logo img").attr("src","./index/page_search_bar/img/logo_color.png");
				$("#page_search_bar .search-form").removeClass("with-theme");
				$("#page_search_bar .search-form").addClass("no-theme");
			});
			
			theme.addUseThemeObserver(function(){
				$("#page_search_bar .logo img").attr("src","./index/page_search_bar/img/logo_white.png");
				$("#page_search_bar .search-form").removeClass("no-theme");
				$("#page_search_bar .search-form").addClass("with-theme");
			});
			
			$(window).scroll(function(){
				var scrollOffset = $(window).scrollTop();
				var targetPos = $("#page_search_bar .search-form").offset().top;
				if (scrollOffset>=167){
					$("#page_search_bar .container .search-form").addClass("fix");
				}
				else{
					$("#page_search_bar .container .search-form").removeClass("fix");
				}
				
			});
		}
	}
})