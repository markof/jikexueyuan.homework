define(function (require, exports, module) {

	var pageContainer = undefined;
	
	// 引入必要模块，并做初始化。
	var html = require("./card_video.html");
	require("reset-css");
	require("./card_video.css");

	var allowLoadData = false;

	module.exports = {
		render: function (container) {
			pageContainer = $(container);
			pageContainer.append(html);

			$(window).on("scroll", loadMore);
		},

		allowLoadData: function () {
			allowLoadData = true;
		}
	}

	function loadMore() {
		if (allowLoadData == false) {
			return false;
		}

		var containerOffset = $("#card-video").offset();
		if (pageContainer.css("display") == "none") {
			return false;
		}

		var containerOffset = $("#card-video").offset().top + $("#card-video").height();
		var scrollOffset = $(window).scrollTop();
		var documentHeight = $(window).height();

		if (containerOffset <= scrollOffset + documentHeight + 40) {
			console.log("containerOffset:" + containerOffset);
			console.log("scrollOffset:" + scrollOffset);
			console.log("documentHeight:" + documentHeight);
			renderMoreData();
		}
	}

	function renderMoreData() {
		$.getJSON("./moreVideodata.html", function (data) {
			var rows = data.rows;
			for (var rowIndex = 0; rowIndex < rows.length; rowIndex++) {
				var type = rows[rowIndex].type == "sm" ? "sm" : "lg"
				var videoItem = $('<div class="video-item"></div>')
				for (var itemIndex = 0; itemIndex < rows[rowIndex].items.length; itemIndex++) {
					var subitem = $('<div class="item-'+type+'"></div>')
					var itemImage = $('<div class="item-'+type+'-img"><img src="' + rows[rowIndex].items[itemIndex].img + '" alt=""><div class="img-cover">' + rows[rowIndex].items[itemIndex].cover + '</div></div>');
					var itemInfo = $('<div class="item-info"><div class="item-title">' + rows[rowIndex].items[itemIndex].title + '</div></div>');
					subitem.append(itemImage);
					subitem.append(itemInfo);
					videoItem.append(subitem);
				}
				$("#card-video .container").append(videoItem);
			}
		});
	}
})