/*****************************************************************************
 * 作者：markof
 * 时间：2015年11月21日
 * 说明：
 * 所有和index页面的，涉及到DOM操作的代码均放置在本文件中。
 * **************************************************************************/

// 全局变量，是临时保存加上HTML标记后的用户输入，方便后续进行高亮重置。
var markedValue = "";
		
// 这里对输出框内容加上html标记，以便后续进行样式修改进行高亮显示。
function markInput(inputValue) {
	var returnValue = "";
	var inputArray = inputValue.split(',');
	for (var index = 0; index < inputArray.length; index++) {
		var inputItem = inputArray[index];
		returnValue += "<span id='e" + index + "'>" + inputItem + "</span>" + ", ";
	}
	return returnValue;
}
		
// 用于显示找到的出现频率最高的元素。
function showTheMost(theMostArray) {
	var themost = document.getElementById('themost');
	var resultHtml = "";
	for (theMost in theMostArray) {
		resultHtml += "出现频率最高的元素：【" + theMostArray[theMost].item + "】, 共出现【" + theMostArray[theMost].count + "】次, 对应的位置是【" + theMostArray[theMost].position + "】<br>";
	}
	themost.innerHTML = resultHtml;
}
		
// DOM操作用于高亮显示指定位置的元素。
function highLightTarget(position) {
	var output = document.getElementById('output');
	output.innerHTML = markedValue;
	for (pos in position) {
		document.getElementById('e' + position[pos]).className = "label label-warning";
	}
}
		
// DOM操作显示所有统计出来的元素的结果，以table形式展现。
function showStatistics(processedResult) {
	var statisticsHtml = ""
	var statistics = document.getElementById('statistics');
	
	// 这里要求输入的参数一定是数组才进行处理。
	if (Array.isArray(processedResult) && processedResult.length > 0) {
		for (resultItem in processedResult) {
			statisticsHtml += "<tr onmouseover='highLightTarget([" + processedResult[resultItem].position + "])'><td>" + processedResult[resultItem].item
			+ "</td><td>" + processedResult[resultItem].count + "</td><td>" + processedResult[resultItem].position + "</td></tr>"
		}
	}
	statistics.innerHTML = statisticsHtml;
}
		
// 对输入进行统一的处理。是程序的入口
function processInput() {
	var input = document.getElementById('input');
	var output = document.getElementById('output');
	var inputValue = input.value;
	markedValue = markInput(inputValue);
	output.innerHTML = markedValue;
	var result = processData(input.value);
	var theMostArray = findTheMost(result);
	showTheMost(theMostArray);
	showStatistics(result);
}