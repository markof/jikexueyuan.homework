define(function (require, exports, module) {
	var $ = require("jquery");
	var html = require("./intro.html");

	require("./intro.css");

	var sliderCompany = require("slider").newSlider();
	var sliderCollage = require("slider").newSlider();
	var sliderPublic = require("slider").newSlider();

	module.exports = {
		render: function (target) {
			$(target).append(html);

			sliderCompany.init("#intro .company .slider-item");

			var sliderCompanyLeft = $("#intro .company .slider-left");
			var sliderCompanyRight = $("#intro .company .slider-right");

			sliderCompanyLeft.on("click", sliderLeftHandler);
			sliderCompanyRight.on("click", sliderRightHandler);

			sliderPublic.init("#intro .public .slider-item")

			var sliderPublicLeft = $("#intro .public .slider-left");
			var sliderPublicRight = $("#intro .public .slider-right");

			sliderPublicLeft.on("click", sliderPublicLeftHandler);
			sliderPublicRight.on("click", sliderPublicRightHandler);

			sliderCollage.init("#intro .collage .slider-item")

			var sliderCollageLeft = $("#intro .collage .slider-left");
			var sliderCollageRight = $("#intro .collage .slider-right");

			sliderCollageLeft.on("click", sliderCollageLeftHandler);
			sliderCollageRight.on("click", sliderCollageRightHandler);

			var mycompany = $("#intro .company .company-slider");
			var mypublic = $("#intro .public .public-slider");
			var mycollage = $("#intro .collage .collage-slider");

			mycompany.on("mouseover", function () {
				sliderCompanyLeft.fadeIn(300);
				sliderCompanyRight.fadeIn(300);
			});
			mypublic.on("mouseover", function () {
				sliderPublicLeft.fadeIn(300);
				sliderPublicRight.fadeIn(300);
			});
			mycollage.on("mouseover", function () {
				sliderCollageLeft.fadeIn(300);
				sliderCollageRight.fadeIn(300);
			});

			mycompany.on("mouseleave", function () {
				sliderCompanyLeft.fadeOut(300);
				sliderCompanyRight.fadeOut(300);
			});
			
			mypublic.on("mouseleave", function () {
				sliderPublicLeft.fadeOut(300);
				sliderPublicRight.fadeOut(300);
			});
			
			mycollage.on("mouseleave", function () {
				sliderCollageLeft.fadeOut(300);
				sliderCollageRight.fadeOut(300);
			});
		}
	};

	function sliderLeftHandler() {
		sliderCompany.slideLeft();
	}

	function sliderRightHandler() {
		sliderCompany.slideRight();
	}

	function sliderPublicLeftHandler() {
		sliderPublic.slideLeft();
	}

	function sliderPublicRightHandler() {
		sliderPublic.slideRight();
	}

	function sliderCollageLeftHandler() {
		sliderCollage.slideLeft();
	}

	function sliderCollageRightHandler() {
		sliderCollage.slideRight();
	}
});