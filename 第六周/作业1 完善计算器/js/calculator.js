/********************************************************
 * 主要的完善点：
 * 【1】for (item in arr)该语句在item没有进行定义的时候是可以在chrom中运行的，但在IE中不行，需要对item进行申明。
 * 
 * 
 * [2015.11.25: IE可以支持到IE9以上版本]
********************************************************/

// 用到的全局变量定义。
var stack;				//用于显示用户历史输入的栈显示面板。
var current;			//用于显示用户当前输入的显示面板。
var percentageTag;		//状态位，true表示当前用户输入是百分数，false表示当前用户输入是正常状态。
var presentingResult;	//状态位，true表示显示面板显示的是结果，false表示显示面板显示的是用户输入。
var countStack;			//主栈，保存了用于计算的数值和操作符。
var waiteData;			//状态位，true表示当前等待用户输入数值。false表示当前等待用户输入操作符。
var tempOperator;		//临时存放待压栈的操作符元素。
		
// 全局初始化函数。
window.onload = function () {
	// 对全局变量进行赋值。
	stack = document.getElementById("calc-stack");
	current = document.getElementById("calc-current");
	clear();
}

// for IE6/7 绑定鼠标悬停事件，用于同一外观。

		
// 清除当前所有操作或者结果。
function clear() {
	// 清除当前所有的显示内容。
	stack.innerHTML = "";
	current.innerHTML = "0";
	countStack = new Array();
	tempOperator = "";

	// 重置所有的状态位
	presentingResult = false;
	percentageTag = false;
	waiteData = true;
}
		
// 管理当前的显示状态，true表示当前显示的是计算结果，而不是用户的输入。
function clearPresentingResult() {
	if (presentingResult == true) {
		current.innerHTML = "0";
		presentingResult = false;
	}
}
		
// 显示栈中的内容到栈显示面板
function displayStack() {
	var displayString = "";
	for (var item in countStack) {
		displayString += countStack[item].value + " ";
	}
	if (tempOperator != "") {
		stack.innerHTML = displayString + tempOperator.value;
	}
	else {
		stack.innerHTML = displayString;
	}
}
		
// 显示除0错误。
function divideZeroError() {
	displayError("被除数不能为0");
}

// 通用错误显示函数
function displayError(error) {
	clear();
	current.innerHTML = error;
	presentingResult = true;
}
		
// 获取当前显示框中的字符对应的数字。
function getCurrentNumber() {
	var currentNumber = Number(current.innerHTML);
	return currentNumber;
}
		
// 计算栈中的结果，并显示到面板上。
function displayResult() {
	current.innerHTML = countInStack();
	presentingResult = true;
}
		
// 用于二元计算，并返回结果。
function count(valueA, valueB, operator) {
	// 判断两个入参是否都是数值，或者可以转化为数值
	if (isNaN(Number(valueA)) || isNaN(Number(valueA))) {
		return 0;
	}
	// 根据操作符来对两个参数操作，并返回结果。
	switch (operator) {
		case '+': return Number(valueA) + Number(valueB);
		case '-': return Number(valueA) - Number(valueB);
		case '*': return Number(valueA) * Number(valueB);
		case '/': return Number(valueA) / Number(valueB);
		default:
			return 0;
	}
}
		
// 计算主栈中的内容，并返回结果。
function countInStack() {
	var resultTemp = 0;
	// 如果当前主栈中元素多余1个。
	if (countStack.length > 1) {
		// 错误处理判断，检查第一个元素是否是数据。而不是操作符。
		if (countStack[0].type == "data") {
			resultTemp = countStack[0].value;
		}
		else {
			return;
		}
		// 遍历栈中的元素，并累计进行二元计算。需要保障栈中的元素数量是大于2且为奇数个。
		for (var index = 1; index < countStack.length; index++) {
			resultTemp = count(resultTemp, countStack[index + 1].value, countStack[index].value);
			index++;
		}
	}
	// 如果当前只有1个元素。
	else {
		resultTemp = countStack[0].value;
	}

	return resultTemp;
}
		
// 对用户当前输入的数值进行压栈。
function stackNumber() {
	// 判断最后一个操作是否为除，同时将要压栈的数据是否为0，作为除零判断。
	var currentNumber = getCurrentNumber();
	// 如果栈中的元素数量大于1个，则说明最后一个压入的应该是操作符。
	if (countStack.length > 1) {
		// 如果最后一个元素是除号，且将要压入的被除数是0，则抛出除零错误。
		if (countStack[countStack.length - 1].value == '/' && currentNumber == 0) {
			divideZeroError();
			return false;
		}
	}
	// 如果栈中的元素只有1个，则直接压入当前显示面板上的数值。
	countStack[countStack.length] = { type: "data", value: currentNumber };
	displayStack();
	return true;
}
		
// 对临时操作符进行压栈。
function stackOperator() {
	// 如果当前临时操作符不是"",则标示当前状态用户有输入过操作符。且等待处理
	if (tempOperator != "" && tempOperator.type == 'operator') {
		countStack[countStack.length] = { type: "operator", value: tempOperator.value };
		tempOperator = "";
	}
	waiteData = false;
	displayStack();
}
	
//回退当前的操作
function backspace() {
	// 由于用户输入了修改显示面板的操作,因此当前的显示状态应该被重置。
	clearPresentingResult();
	var currentInput = current.innerHTML;
	
	// 如果当前只有1个字符，则删除后将显示面板重置为0；如果只有1个元素且为0，则无需操作。
	if (currentInput.length == 1 && currentInput != "0") {
		currentInput = "0";
	}
	// 如果字符大于1个，则消除最后一个字符。
	else if (currentInput.length > 1) {
		currentInput = currentInput.slice(0, currentInput.length - 1);
	}
	current.innerHTML = currentInput;
	presentingResult = false;
	waiteData = false;
}

// 将加减乘除四个操作统一出来，以入参区分是哪种操作。
function operate(operator) {
	// 如果当前已经处于等待输入数值，则标示用户有输入过操作符。
	if (waiteData == true) {
		// 如果栈是空的，并且等待输入数据，只有是初始化的状态才会这样。
		if (countStack.length == 0 && presentingResult == false) {
			current.innerHTML = "0";
			presentingResult = false;
			stackNumber();
		}
		// 如果栈是空的，等待用户输入数据，且当前显示面板显示的是结果，则说明用户刚刚输入过"等号"
		// 这里如果再输入操作符，则压入当前显示的值，然后继续操作。
		else if (countStack.length == 0 && presentingResult == true) {
			stackNumber();
		}
		tempOperator = { type: 'operator', value: operator };
	}
	// 如果当前处于等待输入操作符，如果再次输入操作符，则更替当前准备压栈的操作符。
	else {
		if (stackNumber()) {
			tempOperator = { type: 'operator', value: operator };
			displayResult();
		}
	}
	waiteData = true;
	displayStack();
}
		
// 操作"+"
function operatePlus() {
	operate("+");
}
		
// 操作"-"
function operateMinus() {
	operate("-");
}
// 操作"*"
function operateMultiply() {
	operate("*");
}
		
// 操作"/"
function operateDivide() {
	operate("/");
}

// 处理输入的"="等号操作。
function operateReslut() {
	// 如果当前状态是等待输入数值，要不就是初始化状态，要不就是用户输入过操作符。
	if (waiteData == true) {
		// 栈是空的，说明是初始化状态，则什么都不做。
		if (countStack.length == 0) {
			return;
		}
		// 栈不是空的，则说明刚输入过操作符，则直接计算结果并显示就好。
		else {
			displayResult();
		}
	}
	// 如果当前状态是等待操作，说明输入过数值，需要先将数值压栈后，再处理。
	else if (stackNumber()) {
		displayResult();
	}
	// 其他状态，如果进入这里，则说明出现bug，或者上面的入栈操作出现错误。
	else {
		return;
	}
	waiteData = true;
	countStack = new Array();
	tempOperator = "";
	displayStack();
}
		
// 处理0的输入，不能在数字头部输入多个0；
function inputZero() {
	clearPresentingResult();
	var currentInput = current.innerHTML;
	// 如果当前已经是0了，则直接跳过。
	if (currentInput != "0") {
		inputNumber("0");
	}
	stackOperator();
}
		
// 负数符号位处理
function becomeMinus() {
	var curValue = getCurrentNumber();
	clearPresentingResult();
	var isMinus = 0;
	// 处理负数表示位
	// if (curValue < 0) {
		isMinus = 0 - curValue;
		// minusTag = false;
	// }
	// else {
	// 	isMinus = "-";
	// 	minusTag = true;
	// }
	current.innerHTML = isMinus;
	stackOperator();
}
		
// 处理小数点。
function inputDot() {
	clearPresentingResult();
	var currentInput = current.innerHTML;
	// 只能有一个小数点。如果已经有小数点了，直接跳过。
	if (currentInput.indexOf(".") == -1) {
		inputNumber(".");
	}
	stackOperator();
}
		
// 当头部只有一个0时，删除这个0，再添加其他数字
function inputNumber(inputValue) {
	clearPresentingResult();
	var currentInput = current.innerHTML;
	// 统一处理所有的字符输入，如果已经有一个“0”，出现，用户输入的又是1~9的数值，则直接替换掉当前的0，除了小数点外。
	if (currentInput == "0" && inputValue != ".") {
		currentInput = "";
	}
	current.innerHTML = currentInput + inputValue;
	presentingResult = false;
	stackOperator();
}

// 一元函数操作的结果显示。
function oneDataOperate(result) {
	current.innerHTML = result;
	presentingResult = false;
	waiteData= false;
	stackOperator();
}

// 求当前显示值的平方
function power2() {
	var curValue = getCurrentNumber();
	var result = Math.pow(curValue, 2);
	oneDataOperate(result);
}

// 求当前显示值的正弦，显示值为弧度值。
function sin() {
	var curValue = getCurrentNumber();
	var result = Math.sin(curValue);
	oneDataOperate(result);
}

// 求当前显示值的余弦，显示值为弧度值
function cos() {
	var curValue = getCurrentNumber();
	var result = Math.cos(curValue);
	oneDataOperate(result);
}

// 求当前显示值的正切，显示值为弧度值
function tan() {
	var curValue = getCurrentNumber();
	var result = Math.tan(curValue);
	oneDataOperate(result);
}

// 求当前以10为底，显示值为幂的结果
function powerX(baseValue) {
	var curValue = getCurrentNumber();
	var result = Math.pow(baseValue, curValue);
	oneDataOperate(result);
}

// 求当前显示值的对数
function log() {
	var curValue = getCurrentNumber();
	if (curValue < 0) {
		displayError("无效输入！");
		return;
	}
	if (curValue == 0) {
		displayError("无穷大");
		return;
	}
	var result = Math.log(curValue);
	oneDataOperate(result);
}

// 求当前显示值的二次根
function radical() {
	var curValue = getCurrentNumber();
	if (curValue < 0) {
		displayError("无效输入！");
		return;
	}
	var result = Math.sqrt(curValue);
	oneDataOperate(result);
}

// 得到常量Pi
function pi() {
	var result = Math.PI;
	oneDataOperate(result);
}

	
// 收集用户操作，统一传递给计算器对象
function enter(inputValue) {
	//对用户输入的内容进行分发处理，主要有两类，一类是操作符，一类是数字。 
	switch (inputValue) {
		case "power2":		//二次幂
			power2();
			break;
		case "sin":		//正弦
			sin();
			break;
		case "cos":		//余弦
			cos();
			break;
		case "tan":		//正切
			tan();
			break;
		case "radical":		//求根
			radical();
			break;
		case "10powerX":		//以10为底的幂次
			powerX(10);
			break;
		case "log":		//以2为底的log
			log();
			break;
		case "pi":		//常数pi
			pi();
			break;
		case "c":		//清除
			clear();
			break;
		case "bk":		//回退
			backspace();
			break;
		case "~":		//负数
			becomeMinus();
			break;
		case "+":		//操作符，加
			operatePlus();
			break;
		case "-":		//操作符，减
			operateMinus();
			break;
		case "*":		//操作符，乘
			operateMultiply();
			break;
		case "/":		//操作符，除
			operateDivide();
			break;
		case "=": 		//操作符，等于。
			operateReslut();
			break;
		case ".": 		//操作符，小数点。
			inputDot();
			break;
		case "0": 		//0比较特殊，在首位不能输入多个。
			inputZero();
			break;
		default:
			inputNumber(inputValue);
			break;
	}
}