
var items = document.querySelector(".calc-operate-panel-item");
for (var item in items){
	items[item].addEventListener("onmouseover",mouseOver());
}

function mouseOver(){
	this.style.backgroundcolor = "#2E3236";
}