define(function (require, exports, module) {
	var $ = require("jquery");
	// 引入必要的模块
	var html = require("./nav.html");
	
	var carousel = require("carousel");
	
	var slider = require("slider").newSlider();

	require("reset");
	require("./nav.css");

	var carouselAnimaFadeInTag = false;
	var carouselAnimaFadeOutTag = false;
	
	var sliderAnimaFadeInTag = false;
	var sliderAnimaFadeOutTag = false;
	
	var autoMove;

	module.exports = {
		render: function (target) {
			$(target).append(html);
			
			console.log(slider);

			var pageCarousel = $("#nav .carousel");
			pageCarousel.on("mouseover", showLeftRight);
			pageCarousel.on("mouseleave", hideLeftRight);
			
			carousel.init("#nav .carousel-content .content-item","#nav .carousel-pagenation .pagenation-item");
			
			var moveLeftButton = $("#nav .carousel-left");
			var moveRightButton = $("#nav .carousel-right");
			moveLeftButton.on("click",carousel.moveLeft);
			moveRightButton.on("click",carousel.moveRight);
			
			$("#nav .carousel-pagenation .pagenation-item").on("click",moveToIndex);
			slider.init("#nav .slider .slider-item");
			
			var mySlider = $("#nav .slider");
			mySlider.on("mouseover",showSliderLeftRight);
			mySlider.on("mouseleave",hideSliderLeftRight);
			
			var sliderLeft = $("#nav .slider .slider-left");
			var sliderRight = $("#nav .slider .slider-right");
			sliderLeft.on("click", sliderLeftHandler);
			sliderRight.on("click", sliderRightHandler);

			var extendNavs= $("#nav .sub-extend-nav .extend-list-item");
			extendNavs.on("mouseover",showExtendNav);
			
			var subNav =$("#nav .sub-nav");
			subExtend = $("#nav .sub-extend-nav");
			subNav.on("mouseleave",function(){subExtend.hide();});
			
			var subNavItem = $("#nav .sub-nav .nav-item");
			subNavItem.has(".arrow").on("mouseover",function(){subExtend.show()})

			starAutoMove();
		}
	};
	
	function showExtendNav(){
		var dataName = $(this).attr("data-name");
		var extendNav = $("#nav .sub-extend-nav .extend-nav-item[data-name='"+ dataName +"']");
		
		$("#nav .sub-extend-nav .extend-nav-item").hide();
		extendNav.show();
	}
	
	function sliderLeftHandler(){
		slider.slideLeft();
	}
	
	function sliderRightHandler(){
		slider.slideRight();
	}
	
	function starAutoMove(){
		clearAutoMove()
		autoMove = setInterval(carousel.moveRight,5000);
	}
	
	function clearAutoMove(){
		clearInterval(autoMove);
	}
	
	function moveToIndex(){
		carousel.moveToIndex($("#nav .carousel-pagenation .pagenation-item").index(this));
	}
	
	function showSliderLeftRight() {
		console.log("showSliderLeftRight");
		if (sliderAnimaFadeInTag == false) {
			sliderAnimaFadeInTag = true;
			$("#nav .slider .slider-left").fadeIn(300);
			$("#nav .slider .slider-right").fadeIn(300, function () {
				sliderAnimaFadeInTag = false;
			});
		}
	}

	function hideSliderLeftRight() {
		console.log("hideSliderLeftRight");
		if (sliderAnimaFadeOutTag == false) {
			sliderAnimaFadeOutTag = true;
			$("#nav .slider .slider-left").fadeOut(300);
			$("#nav .slider .slider-right").fadeOut(300, function () {
				sliderAnimaFadeOutTag = false;
			});
		}
	}

	function showLeftRight() {
		if (carouselAnimaFadeInTag == false) {
			carouselAnimaFadeInTag = true;
			$("#nav .carousel-left").fadeIn(300);
			$("#nav .carousel-right").fadeIn(300, function () {
				carouselAnimaFadeInTag = false;
			});
		}
		clearAutoMove();
	}

	function hideLeftRight() {
		if (carouselAnimaFadeOutTag == false) {
			carouselAnimaFadeOutTag = true;
			$("#nav .carousel-left").fadeOut(300);
			$("#nav .carousel-right").fadeOut(300, function () {
				carouselAnimaFadeOutTag = false;
			});
		}
		starAutoMove();
	}
});