define(function (require, exports, module) {
	
	// 引入必要模块，并做初始化。
	var html = require("./tool_theme.html");
	require("reset-css");
	var container = $("#tool_theme");
	var themetarget = "";
	require("./tool_theme.css");
	var recent = {};

	var noThemeFunc = [];
	var useThemeFunc = [];
	var opacityFunc=[];

	module.exports = {
		// 定义对外接口
		show: function () {
			$("#tool_theme").animate({ top: "0", opacity: "1" }, 300);
		},

		hide: hideMyself,

		addNoThemeObserver: addNoThemeCallback,

		addUseThemeObserver: addUseThemecallback,
		
		addOpacityObserver: addOpacitycallback,
		
		updateTheme:function(){
			currentTheme();
			updateRecent();
		},

		render: function (container, target) {
			container = $(container);
			container.append(html);
			themetarget = $(target);

			// 绑定Tab的外观改变事件
			$("#tool_theme .top-bar-nav-item").on("click", activeItem);
			container.css("top", -container.outerHeight());
			$("#tool_theme_hide").on("click", hideMyself);
			$("#tool_theme .theme-item").on("click", changeTheme);
			$("#tool_theme .top-bar-nav-item").on("click", showTab);
			$("#tool_theme_noTheme").on("click", doNotUseTheme);
			
			// 这一句主要是捕获自身的点击事件，避免事件传递给父级对象
			container.on("click", function (e) { e.stopPropagation(); return; });

			$("#tool_theme .theme-item").on("mouseover", previewTheme);
			
			$("#tool_theme_opacity").change(changeOpacity);
		}
	};
	
	function changeOpacity(){
		var value = Number($("#tool_theme_opacity").val());
		$("#theme-opacity-output").html(value+"%");
		for (var index = 0; index < opacityFunc.length; index++) {
			opacityFunc[index](value/100);
		}
	}
	
	function addOpacitycallback(func){
		opacityFunc[opacityFunc.length] = func;
	}

	function doNotUseTheme() {
		themetarget.css({
			"background-image": "none",
			"background-size": "cover",
			"background-attachment": "fixed"
		});

		for (var index = 0; index < noThemeFunc.length; index++) {
			noThemeFunc[index]();
		}

		window.localStorage["currentTheme"] = "";
	}

	function addNoThemeCallback(func) {
		noThemeFunc[noThemeFunc.length] = func;
	}

	function addUseThemecallback(func) {
		useThemeFunc[useThemeFunc.length] = func;
	}

	function currentTheme() {
		var currentTheme = window.localStorage["currentTheme"];
		if (currentTheme !== undefined) {
			if (currentTheme == "") {
				doNotUseTheme();
				return;
			}

			themetarget.css({
				"background-image": "url(\"" + window.localStorage["currentTheme"] + "\")",
				"background-size": "cover",
				"background-attachment": "fixed"
			});
			
			for (var index = 0; index < noThemeFunc.length; index++) {
				useThemeFunc[index]();
			}
		}
		else{
			doNotUseTheme();
		}
	}

	function updateRecent() {
		recent = window.localStorage["recentTheme"];
		if (recent !== undefined) {
			recent = recent.split(",");
			for (var index = 0; index < recent.length; index++) {
				$("#tool_theme .recent-theme .recent-theme-item").eq(index).css("background-image", "url(" + recent[index] + ")");
			}
		}
		else {
			recent = [];
		}
	}

	function addRecent(item) {
		if (recent.indexOf(item) == -1) {
			recent.unshift(item);
		}
		else {
			return;
		}

		if (recent.length > 27) {
			recent.pop();
		}
		window.localStorage["recentTheme"] = recent;
		updateRecent();
	}

	function showTab(e) {
		var tab = $(this).attr("data-name");
		$("#tool_theme .tab-item").hide();
		$("#tool_theme .tab-item[data-name='" + tab + "']").show();
	}

	function changeTheme(e) {
		var themeImage = $(this).children("img").attr("src")
		themetarget.css({
			"background-image": "url(\"" + themeImage + "\")",
			"background-size": "cover",
			"background-attachment": "fixed"
		});
		addRecent(themeImage);
		window.localStorage["currentTheme"] = themeImage;
		e.stopPropagation();

		for (var index = 0; index < noThemeFunc.length; index++) {
			useThemeFunc[index]();
		}
	}

	function activeItem(e) {
		$("#tool_theme .top-bar-nav-item").removeClass("active");
		$(this).addClass("active");
		e.stopPropagation();
	}

	function hideMyself() {
		container.animate({ top: -container.outerHeight(), opacity: "0" }, 300);
	}

	function previewTheme() {
		$("#tool_theme .theme-preview").css("background-image", "url(\"" + $(this).children("img").attr("src") + "\")");
	}
})