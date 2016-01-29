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
			
			var navBar = $("#header .nav-link");
			navBar.on("mouseover",showExtend);
			navBar.on("mouseleave",hideExtend);
			
			var navExend = $("#header .nav-extend");
			navExend.on("mouseover",showExtend);
			navExend.on("mouseleave",hideExtend);
			
			var navTopItems = $("#header .nav-link-item");
			navTopItems.on("mouseover",activeExtend);
			navTopItems.on("mouseleave",clearActiveExtend);
		}	
	};
	
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
		$("#header .nav-extend .extend-item[data-name='"+ dataName +"']").addClass("active");
	}
	
	function clearActiveExtend(e){
		$("#header .nav-extend .extend-item").removeClass("active");
	}
	
});