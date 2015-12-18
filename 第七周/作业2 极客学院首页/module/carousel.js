define(function (requier, exports, module) {

	var $ = requier("jquery");

	var carouselItems;
	var carouselPagenations;
	var speed = 300;
	var currIndex = 0;
	var itemsCount;
	var animaTag = false;
	var allItemLength = 0;

	module.exports = {
		moveRight: moveRight,

		moveLeft: moveLeft,

		moveToIndex: function (indexValue) {
			var curIndex = getCurrentIndex();
			
			if(curIndex == indexValue){
				return;
			}
			
			if (indexValue>=0 && indexValue<=(itemsCount-1)){
				if (Math.abs(indexValue - curIndex) == 1 ){
					indexValue>curIndex?
					moveRight():moveLeft();
					return;
				}
				
				var moveFunc = indexValue>curIndex?moveRightTo:moveLeftTo;
				
				var gap = Math.abs(indexValue-curIndex);
				var moveDistance = gap*$(carouselItems[curIndex]).width();
				moveFunc(moveDistance,gap);
			}
		},

		setSpeed: function (speedValue) {
			var tempSpeed = Number(speedValue);
			if (!isNaN(tempSpeed)) {
				speed = tempSpeed;
			}
		},

		init: function (items, pagenations) {
			carouselItems = $(items).toArray();
			carouselPagenations = $(pagenations).toArray();

			if (carouselItems.lenght != carouselPagenations.length) {
				//warrning, 指示器与要切换的元素的数量不一致。
			}

			var curPos = 0;
			for (var index = 0; index < carouselItems.length; index++) {
				$(carouselItems[index]).css("left", curPos);
				curPos += $(carouselItems[index]).width();
			}
			allItemLength = curPos;
			itemsCount = carouselItems.length;
		}
	};

	function getCurrentIndex() {
		var currentIndex;
		if (currIndex >= 0) {
			currentIndex = currIndex / itemsCount;
		}
		else {
			currentIndex = itemsCount + (currIndex / itemsCount);
		}
		return currentIndex;
	}

	function activePagenation() {
		$(carouselPagenations).removeClass("active");
		$(carouselPagenations[getCurrentIndex()]).addClass("active");
	}
	
	function moveLeft(){
		moveLeftTo($(carouselItems[getCurrentIndex()]).width(),1);
	}
	
	function moveRight(){
		moveRightTo($(carouselItems[getCurrentIndex()]).width(),1);
	}
	
	function moveLeftTo(distance,gap) {
		if (animaTag == false) {
			var currentIndex = getCurrentIndex();
			var currentItem = $(carouselItems).eq(currentIndex);
			var curPos = parseInt(currentItem.css("margin-left"));
			var moveDistance = distance;
			var nextItem;

			if (currentIndex <= 0) {
				nextItem = $(carouselItems).last();
				animaTag = true;
				nextItem.css("margin-left", -allItemLength);
				nextItem.animate({ "margin-left": -allItemLength + moveDistance }, speed);
				currentItem.animate({ "margin-left": curPos + moveDistance },
					speed, function () {
						$(carouselItems).css("margin-left", -allItemLength + moveDistance);
						animaTag = false;
						currIndex = (itemsCount - 1) * itemsCount;
						activePagenation();
					});
			}
			else {
				animaTag = true;
				$(carouselItems).animate({
					"margin-left": curPos + moveDistance
				}, speed, function () {
					currIndex-= gap;
					activePagenation();
					animaTag = false;
				});
			}
		}
	}

	function moveRightTo(distance,gap) {
		if (animaTag == false) {
			var currentIndex = getCurrentIndex();
			var currentItem = $(carouselItems).eq(currentIndex);
			var curPos = parseInt(currentItem.css("margin-left"));
			var moveDistance = distance;
			var nextItem;

			if (currentIndex >= (itemsCount - 1)) {
				nextItem = $(carouselItems).first();
				animaTag = true;
				nextItem.css("margin-left", currentItem.width());
				nextItem.animate({ "margin-left": 0 }, speed);
				currentItem.animate({ "margin-left": curPos - moveDistance },
					speed, function () {
						$(carouselItems).css("margin-left", 0);
						animaTag = false;
						currIndex = 0;
						activePagenation();
					});
			}
			else {
				animaTag = true;
				$(carouselItems).animate({
					"margin-left": curPos - moveDistance
				}, speed, function () {
					currIndex+= gap;
					activePagenation();
					animaTag = false;
				});
			}
		}
	}

});