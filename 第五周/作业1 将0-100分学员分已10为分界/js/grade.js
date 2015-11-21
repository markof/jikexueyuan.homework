// 通用的用于计算函数执行时间的函数，至少输入两个参数
// 返回执行用时，单位为ms
// 经过实际测试，作业的计算量太少，在我机器上基本都是1ms内解决，所以基本无法用该函数计算出各个方法的计算性能差异。
function calcTimeConsumption(targeFunc, inputValue) {
	var start = new Date();
	var result = targeFunc(inputValue);
	var end = new Date();
	return [(end - start),result];
}
		
// 分级方法1，采用if条件语句判断,返回等级
// 最为传统的方法。如果可以的话，可以调整判断的顺序，这样提高命中概率，以便提高性能。
function gradeFunc_1(inputValue) {
	// 判断是否在0到10之间，不包含10
	if (inputValue >= 0 && inputValue < 10) {
		return 10;
	} else if (inputValue < 20) {
		return 9;
	} else if (inputValue < 30) {
		return 8;
	} else if (inputValue < 40) {
		return 7;
	} else if (inputValue < 50) {
		return 6;
	} else if (inputValue < 60) {
		return 5;
	} else if (inputValue < 70) {
		return 4;
	} else if (inputValue < 80) {
		return 3;
	} else if (inputValue < 90) {
		return 2;
	} else if (inputValue <= 100) {
		return 1;
	}
}
		
// 分级方法2，采用数学计算方法，使用有限switch case，预先刨掉100和0。
// 由于算法，不得不使用向下取整。也可以采用转成字符串后再进行字符串截取。
function gradeFunc_2(inputValue) {
	switch (inputValue) {
		case 100:
			return 1;
		case 0:
			return 10;
		default:
			return 10 - Math.floor(inputValue / 10);
	}
}

// 分级方法3，采用数组查表法,使用for循环
// 这里采用的是字符串的map定义，采用系统函数进行查询以保证性能
// 也可以使用纯数字的定义，但是for循环太多，这样就无法保证性能。
// 方法3的map定义部分
var gradeMap = [
	",90,91,92,93,94,95,96,97,98,99,100,",
	",80,81,82,83,84,85,86,87,88,89,",
	",70,71,72,73,74,75,76,77,78,79,",
	",60,61,62,63,64,65,66,67,68,69,",
	",50,51,52,53,54,55,56,57,58,59,",
	",40,41,42,43,44,45,46,47,48,49,",
	",30,31,32,33,34,35,36,37,38,39,",
	",20,21,22,23,24,25,26,27,28,29,",
	",10,11,12,13,14,15,16,17,18,19,",
	",0,1,2,3,4,5,6,7,8,9,"];
// 方法3的函数部分
function gradeFunc_3(inputValue) {
	for (var index = 0; index < gradeMap.length; index++) {
		if (gradeMap[index].indexOf("," + inputValue.toString() + ",") != -1) {
			return index + 1;
		}
	}
}