/**
 * 通用幻灯片模块，基于Jquery.
 * 
 * 使用要求：
 * 参与幻灯片的模块需要float:left,水平进行布局。
 * 父元素可随意，为了效果建议父元素设置overflow:hiden。
 * 
 * 函数说明：
 * init(slideItemSeletor)用于初始化，参数为参与幻灯片的元素的选择符。
 * slideLeft()所有元素向左移动进行幻灯。
 * slideRight()所有元素向右移动进行幻灯。
 * getCurrentIndex()返回对外呈现的幻灯片的第一个元素的索引。
 * setAnimationSpeed(speed)设置幻灯片的动画速度。默认300ms。
 * 
 * 作者：zhanglei
 * 日期：2015.12.06 
*/

define(function (require, exports, module) {
	// 引入jQuery
	var $ = require("jquery");

	function sliderClass() {
	}

	(function () {
		
		// 用于记录对外显示的第一个元素的索引
		this.currentIndex = 0;
		
		// 数组，用于对目标元素进行状态保存。
		this.items = [];
		
		// 用于记录当前参与幻灯片的元素的个数
		this.itemCount = 0;
		
		// 设置动画的速度，默认300毫秒
		this.animaSpeed = 300;
		
		var animaTag = false;

		sliderClass.prototype.init = function (slideItemSeletor) {
			this.items = $(slideItemSeletor).toArray();
		}

		sliderClass.prototype.slideRight = function () {
			if (animaTag == false) {
				var items = this.items;
				var animaSpeed = this.animaSpeed;
				animaTag = true;
				var orgMargin = parseInt($(items).first().css("margin-left"));
				console.log(orgMargin);
				$(items).first().animate({
					"margin-left": -($(items).first().outerWidth()+orgMargin)
				}, animaSpeed, function () {
					$(items).last().after($(items).first());
					$(items).first().css("margin-left", orgMargin);
					items.push(items.shift());
					animaTag = false;
				});
			}
		}

		sliderClass.prototype.slideLeft = function () {
			if (animaTag == false) {
				var items = this.items;
				var animaSpeed = this.animaSpeed;
				animaTag = true;
				var orgMargin = parseInt($(items).first().css("margin-left"));
				$(items).last().css("margin-left", -($(items).first().outerWidth()+orgMargin));
				$(items).first().before($(items).last());
				items.unshift(items.pop());
				$(items).first().animate({
					"margin-left": orgMargin
				}, animaSpeed, function () {
					animaTag = false;
				});
			}
		}

		sliderClass.prototype.setAnimationSpeed = function (speed) {
			if (!isNaN(speed)) {
				var tempSpeed = Number(speed);
				if (tempSpeed >= 0) {
					this.animaSpeed = tempSpeed;
				}
			}
		}

		sliderClass.prototype.getCurrentIndex = function () {
			var currentIndex = 0;
			if (this.currentIndex >= 0) {
				currentIndex = currentIndex % this.itemCount;
			}
			else {
				currentIndex = this.itemCount + (currentIndex % this.itemCount);
			}
			return currentIndex;
		}
	} ());
	// 导出对外模块可使用的方法
	module.exports = {
		newSlider: function () {
			return new sliderClass();
		}
	}
});