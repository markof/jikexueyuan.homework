define(function(require, exports, module){
	
	// 引入jquery
	var $ = require("jquery");
	require("reset");
	require("./header.css");
	var html = require("./header.html");
	var container;
	
	module.exports={
		render:function(target){
			container = $(target);
			container.append(html);
			
			var searchInput = $("#header .search-input");
			searchInput.on("focus",searchBarFocus);
			searchInput.on("focusout",searchBarFocusOut);
			
			var navBar = $("#header .nav-bar .nav-left");
			navBar.on("mouseover",showExtend);
			navBar.on("mouseleave",hideExtend);
			
			var navExend = $("#header .nav-extend");
			navExend.on("mouseover",showExtend);
			navExend.on("mouseleave",hideExtend);
			
			var navTopItems = $("#header .nav-bar .nav-left-item");
			navTopItems.on("mouseover",activeExtend);
			navTopItems.on("mouseleave",clearActiveExtend);
		}	
	};
	
	function searchBarFocus(e){
		$("#header .search-hot").hide();
		$("#header .search-button").addClass("active");
		e.stopPropagation();
	}
	
	function searchBarFocusOut(e){
		$("#header .search-hot").show();
		$("#header .search-button").removeClass("active");
		e.stopPropagation();
	}
	
	function showExtend(e){
		$("#header .nav-extend").show();
		e.stopPropagation();
	}
	
	function hideExtend(e){
		$("#header .nav-extend").hide();
		e.stopPropagation();
	}
	
	function activeExtend(e){
		var dataName = $(this).attr("data-name");
		console.log($("#header .nav-extend .extend-item[data-name='"+ dataName +"']"));
		$("#header .nav-extend .extend-item[data-name='"+ dataName +"']").addClass("active");
	}
	
	function clearActiveExtend(e){
		$("#header .nav-extend .extend-item").removeClass("active");
	}
	
});