/*****************************************************************************
 * 作者：markof
 * 时间：2015年11月21日
 * 说明：
 * 用于生成随机的以单个字母的随机字符串，字符串最后多包含一个",",该','也可以去掉,
 * 这里目前为了使得空元素被包含，先暂时没有去掉。
 * **************************************************************************/

var alphabetMap = [
'a', 'b', 'c', 'd', 'e', 'f', 'g',
'h', 'i', 'j', 'k', 'l', 'm', 'n',
'o', 'p', 'q', 'r', 's', 't', 'u', 
'v', 'w', 'x', 'y', 'z'];

// 在A~Z,26个字母中随机挑选10~100个，组成数组。
// 参数：obj，随机结果输出对象，默认当字符串处理，用于在DOM对象中查找输出对象。
// 返回值：无
function crateRandomArray(obj) {
	var output = document.getElementById(obj);
	// 这里先随机产生一个10~90的数值，用于生成元素的个数
	var count = Math.round(90 * Math.random()) + 10;
	var result = "";
	
	// 这里依照之前生成的元素的个数，在字母表中随机挑选字母。
	for (var index = 0; index < count; index++) {
		result += alphabetMap[Math.round(25 * Math.random())] + ",";
	}

	output.value = result;
	output.onchange();
}