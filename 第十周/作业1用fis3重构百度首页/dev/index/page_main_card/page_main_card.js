define(function (require, exports, module) {

	var pageContainer = undefined;
	
	// 引入必要模块，并做初始化。
	var html = require("./page_main_card.html");
	var theme = require("theme");
	require("reset-css");
	require("./page_main_card.css");

	var card_my = require("./card_my/card_my");
	var card_advice = require("./card_advice/card_advice");
	var card_nav = require("./card_nav/card_nav");
	var card_novel = require("./card_novel/card_novel");
	var card_shopping = require("./card_shopping/card_shopping");
	var card_sports = require("./card_sports/card_sports");
	var card_video = require("./card_video/card_video");

	module.exports = {
		render: function (container) {
			pageContainer = $(container);
			pageInit();

			theme.addNoThemeObserver(noTheme);
			theme.addUseThemeObserver(useTheme);
			theme.addOpacityObserver(changeOpacity);
		}
	}

	function changeOpacity(opacity) {
		console.log(opacity);
		console.log($("#page_main_card .bg").css("background-color", "rgba(255,255,255," + opacity + ")"));
	}

	function noTheme() {
		$(".tab-content-container").addClass("bordered");
		$("#page_main_card .tabs").addClass("bordered");
	}

	function useTheme() {
		$(".tab-content-container").removeClass("bordered");
		$("#page_main_card .tabs").removeClass("bordered");
	}

	function pageInit() {
		pageContainer.append(html);
		$("#page_main_card .tab-item").on("click", activeTab);
		$("#page_main_card .tab-item-config").on("click", activeTabConfig);
		$("#page_main_card .tab-content-config").on("click", function (e) { e.stopPropagation(); });
		$(document).on("click", closeTabConfig);
		
		// fireforx
		$(window).on("wheel", scrollHandler);
		// 适配webkit，opera，IE
		$(window).on("mousewheel", scrollHandler);

		$("#page_main_card .amina-icon-more").on("click", function () {
			showMore();
			hideAnimaArrrow();
		});

		card_my.render("#card-my");
		card_advice.render("#card_advice");
		card_nav.render("#card-nav");
		card_novel.render("#card-novel");
		card_shopping.render("#card-shopping");
		card_sports.render("#card-sports");
		card_video.render("#card-video");
	}

	function hideAnimaArrrow() {
		$("#page_main_card .amina-icon-more").hide();
	}

	function showMore() {
		$("#page_main_card .tab-content").css("height", "auto");
		card_video.allowLoadData();

	}

	function scrollHandler(e) {
		clientHeight = document.documentElement.clientHeight;
		pageOffset = window.pageYOffset;
		documentHeight = $("body").height();
				
		// 判断是否已经到页底。
		if (clientHeight + pageOffset >= documentHeight) {
			// 判断鼠标滚轮是否还是向下滚动。e.originalEvent.wheelDelta适配IE，e.originalEvent.deltaY适配其他
			if (e.originalEvent.deltaY > 0 || e.originalEvent.wheelDelta < 0) {
				showMore();
				hideAnimaArrrow();
			}
		}
	}

	function closeTabConfig(e) {
		$("#page_main_card .tab-content-config").slideUp(300);
		e.stopPropagation();
	}

	function activeTabConfig(e) {
		$("#page_main_card .tab-content-config").slideToggle(300);
		e.stopPropagation();
	}

	function activeTab(e) {
		var tab = $(this).attr("data-name");
		$("#page_main_card .tab-item").removeClass("tab-item-active");
		$(this).addClass("tab-item-active");
		$("#page_main_card .tab-content").hide();
		$("#page_main_card .tab-content").removeClass("");
		$("#card-" + tab + "").show();
	}

});