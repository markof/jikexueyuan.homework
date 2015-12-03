define(function(require, exports, module){
	
	// 引入必要模块，并做初始化。
	var html = require("./tool_theme.html");
	var container = $("#tool_theme");
	var target = "";
	require("./tool_theme.css");
	var recent = {};
	
	module.exports = {
		// 定义对外接口
		show:function(){
			$("#tool_theme").animate({ top: "0",opacity:"1"}, 300);
		},
		
		hide:hideMyself,
		
		target:function(object){
			target = $(object);
		},
		
		render:function(container){
			container = $(container);
			container.append(html);
			
			// 绑定Tab的外观改变事件
			$(".top-bar-nav-item").on("click",activeItem);
			
			// 一开始隐藏自己
			container.css("top",-container.outerHeight());
			
			// 点击收起，隐藏自己。
			$("#tool_theme_hide").on("click",hideMyself);
			
			$(".theme-item").on("click",changeTheme);
			
			$(".top-bar-nav-item").on("click",showTab);
			
			updateRecent();
			
			// 这一句主要是捕获自身的点击事件，避免事件传递给父级对象
			container.on("click",function(e){e.stopPropagation();return;});
			
			$("#tool_theme .theme-item").on("mouseover", previewTheme);		
		}
	}
	
	function updateRecent(){
		recent = window.localStorage["recentTheme"].split(",");
		if (recent != "undifined" && Array.isArray(recent)){
			for (var index=0; index< recent.length; index++){
				$(".recent-theme .recent-theme-item").eq(index).css("background-image","url("+ recent[index] +")");
			}
		}
		else{
			recent = [];
		}
	}
	
	function addRecent(item){
		if (recent.indexOf(item) == -1){
			recent.unshift(item);
		}
		else{
			return;
		}
		
		if (recent.length > 27){
			// recent.pop();
		}
		window.localStorage["recentTheme"]=recent;
		updateRecent();
	}
	
	function showTab(e){
		var tab = $(this).attr("data-name");
		$(".tab-item").hide();
		$(".tab-item[data-name='"+ tab +"']").show();
	}
	
	function changeTheme(e){
		console.log(target);
		target.css({
			"background-image":"url(\""+$(this).children("img").attr("src")+"\")",
			"background-size":"cover"
		});
		e.stopPropagation();
		addRecent($(this).children("img").attr("src"));
	}
	
	function activeItem(e){
		$(".top-bar-nav-item").removeClass("active");
		$(this).addClass("active");
		e.stopPropagation();
	}
	
	function hideMyself(){
		container.animate({ top: -container.outerHeight(),opacity:"0"}, 300);
	}
	
	function previewTheme(){
		console.log("preview theme");
		console.log($(this).children("img").attr("src"));
		console.log($("#tool_theme .theme-preview").css("background-image"));
		$("#tool_theme .theme-preview").css("background-image","url(\""+$(this).children("img").attr("src")+"\")");
	}
})