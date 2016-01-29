define(function(require, exports, module){
	var $ = require("jquery");
	var html = require("./course.html");
	
	require("reset");
	require("./course.css");
	
	module.exports={
		render:function(target){
			$(target).append(html);
			
			var contentItems = $("#course .content .content-item");
			contentItems.on("mouseover",expandContent);
			contentItems.on("mouseleave",foldeContent);
			
			var navItems = $("#course .nav .nav-item");
			navItems.on("mouseover",showContent);
			
		}
	};
	
	function showContent(){
		var navItems = $("#course .nav .nav-item");
		var contentItems =  $("#course .content");
		var dataName = $(this).attr("data-name");
		
		navItems.removeClass("active");
		$(this).addClass("active");
		
		contentItems.hide();
		contentItems.filter("[data-name='" +dataName+ "']").show();
		
	}

	function expandContent(){
		var contentItem = $(this);
		contentItem.css("z-index","999");
		var intro = contentItem.find(".content-intro");
		var peoples = contentItem.find(".peoples");
		var level = contentItem.find(".level");
		
		peoples.show();
		level.show();
		intro.slideDown(300);

	}
	
	function foldeContent(){
		var contentItem = $(this);
		var peoples = contentItem.find(".peoples");
		var intro = contentItem.find(".content-intro");
		var level = contentItem.find(".level");
		
		intro.slideUp(300,function(){
			contentItem.css("z-index","0");
		});
		peoples.hide();
		level.hide();
	}
	
	
	
});