var DoughnutData_1 = [
	{
		value: 30,
		color:"#1ca8dd"
	},
	{
		value : 50,
		color : "#1bc98e"
	}
];

var DoughnutData_2 = [
	{
		value: 90,
		color:"#1ca8dd"
	},
	{
		value : 50,
		color : "#1bc98e"
	}
];

var DoughnutData_3 = [
	{
		value: 10,
		color:"#1ca8dd"
	},
	{
		value : 50,
		color : "#1bc98e"
	}
];

var Salsedata = {
	labels : ["January","February","March","April","May","June","July"],
	datasets : [
		{
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : [65,59,90,81,56,55,40]
		},
		{
			fillColor : "rgba(151,187,205,0.5)",
			strokeColor : "rgba(151,187,205,1)",
			pointColor : "rgba(151,187,205,1)",
			pointStrokeColor : "#fff",
			data : [28,48,40,19,96,27,100]
		}
	]
}

// Line.defaults['scaleShowLabels'] = true;


var DoughnutOptions = {
	//Boolean - Whether we should show a stroke on each segment
	segmentShowStroke : true,
	//String - The colour of each segment stroke
	segmentStrokeColor : "rgb(37, 40, 48)",
	//Number - The width of each segment stroke
	segmentStrokeWidth : 4,
	//The percentage of the chart that we cut out of the middle.
	percentageInnerCutout : 80,
	//Boolean - Whether we should animate the chart	
	animation : true,
	//Number - Amount of animation steps
	animationSteps : 25,
	//String - Animation easing effect
	animationEasing : "easeOut",
	//Boolean - Whether we animate the rotation of the Doughnut
	animateRotate : true,
	//Boolean - Whether we animate scaling the Doughnut from the centre
	animateScale : false,
	//Function - Will fire on animation completion.
	onAnimationComplete : null
}

var ctx_1 = document.getElementById("myChart_1").getContext("2d");
var ctx_2 = document.getElementById("myChart_2").getContext("2d");
var ctx_3 = document.getElementById("myChart_3").getContext("2d");
var ctx_4 = document.getElementById("myChart_4").getContext("2d");
var myNewChart_1 = new Chart(ctx_1).Doughnut(DoughnutData_1,DoughnutOptions);
var myNewChart_2 = new Chart(ctx_2).Doughnut(DoughnutData_2,DoughnutOptions);
var myNewChart_3 = new Chart(ctx_3).Doughnut(DoughnutData_3,DoughnutOptions);
var myNewChart_4 = new Chart(ctx_4).Line(Salsedata);

