// 定义主题的相关参数
var theme1 ={bg_img:"url(img/bg1.jpg)",theme_color:"#EBC1CB",alter_color:"#EBC1CB",bg_color:"#FDFDF8",font_color:"#48274E",header_text:"#EEF",hover_text_color:"#EBC1CB"};
var theme2 ={bg_img:"url(img/bg2.jpg)",theme_color:"#96C8FF",alter_color:"#96C8FF",bg_color:"#F8FDFD",font_color:"#28272E",header_text:"#EEF",hover_text_color:"#96C8FF"};
var theme3 ={bg_img:"url(img/bg3.jpg)",theme_color:"#0D131E",alter_color:"#BBBBBB",bg_color:"#23293C",font_color:"#B9B9B9",header_text:"#EEF",hover_text_color:"#FFFFFF"};
var theme4 ={bg_img:"url(img/bg4.jpg)",theme_color:"#0D131E",alter_color:"#FF8080",bg_color:"#200000",font_color:"#B9B9B9",header_text:"#EEF",hover_text_color:"#FF8080"};
var theme5 ={bg_img:"url(img/bg5.jpg)",theme_color:"#597307",alter_color:"#9AB647",bg_color:"#F2EDC0",font_color:"#000000",header_text:"#EEF",hover_text_color:"#8DA111"};
var theme6 ={bg_img:"url(img/bg6.jpg)",theme_color:"#A0AFAF",alter_color:"#444444",bg_color:"#FFFFFF",font_color:"#222222",header_text:"#111",hover_text_color:"#707F7F"};
var themes={"theme1":theme1,"theme2":theme2,"theme3":theme3,"theme4":theme4,"theme5":theme5,"theme6":theme6};

// 用于保存当前用户的主题。
var currentTheme = {};


// 绑定主题更换的鼠标事件,并做主题的初始化
window.onload = function(){
	var theme1  = document.getElementById("theme1");
	var theme2  = document.getElementById("theme2");
	var theme3  = document.getElementById("theme3");
	var theme4  = document.getElementById("theme4");
	var theme5  = document.getElementById("theme5");
	var theme6  = document.getElementById("theme6");
	var themeClear = document.getElementById("themeClear");
	theme1.addEventListener("click",changeThemeHandler,false); 
	theme2.addEventListener("click",changeThemeHandler,false); 
	theme3.addEventListener("click",changeThemeHandler,false); 
	theme4.addEventListener("click",changeThemeHandler,false); 
	theme5.addEventListener("click",changeThemeHandler,false); 
	theme6.addEventListener("click",changeThemeHandler,false);
	themeClear.addEventListener("click",clearTheme,false); 
	
	// 这里通过localstrorage来存储用户的主题信息。
	var userTheme = window.localStorage["userTheme"];
	if (userTheme!="undefined"){
		changeTheme(themes[userTheme]);
	}
}

// 恢复默认
function clearTheme(){
	var userTheme = window.localStorage["userTheme"];
	if (userTheme!="undefined"){
		window.localStorage.removeItem("userTheme");
		window.location.reload();
	}
}

// 统一处理主题更换的点击操作
function changeThemeHandler(){
	changeTheme(themes[this.dataset.theme]);
	window.localStorage["userTheme"] = this.dataset.theme;
}

//更换指定的主题 
function changeTheme(theme){
	// 全局变量赋值
	currentTheme = theme;
	
	// 页面背景的图片
	document.getElementsByTagName("body")[0].style.backgroundImage = currentTheme.bg_img;
	
	// 修改搜索框部分的文字颜色和特殊元素颜色
	console.log("ready change header");
	var header = document.getElementsByClassName("header")[0];
	var aTagInHeader = header.getElementsByTagName("a");
	for (var item = 0 ; item < aTagInHeader.length; item++){
		aTagInHeader[item].style.color = currentTheme.header_text;
	}
	
	// 修改所有采用醒目颜色作为背景的原色
	console.log("ready change altercolor-bg");
	var alterbgs = document.getElementsByClassName("altercolor-bg");
	for (var item = 0 ; item < alterbgs.length; item++){
		alterbgs[item].style.backgroundColor = currentTheme.alter_color;
	}
	
	// 修改所有采用主题色作为颜色的文字颜色
	console.log("ready change themecolor-text");
	var themetexts = document.getElementsByClassName("themecolor-text");
	for (var item = 0 ; item < themetexts.length; item++){
		themetexts[item].style.color = currentTheme.alter_color;
	}
	
	// 修改主导航条的文字颜色
	console.log("ready change site-nav a tag");
	var siteNav = document.getElementsByClassName("site-nav")[0];
	siteNav.style.backgroundColor = currentTheme.theme_color;
	var liInSiteNav = siteNav.getElementsByTagName("li");
	for (var item = 0 ; item < liInSiteNav.length; item++){
		liInSiteNav[item].style.backgroundColor = currentTheme.bg_color;
	}
	var aTagInSiteNav = siteNav.getElementsByTagName("a");
	for (var item = 0 ; item < aTagInSiteNav.length; item++){
		aTagInSiteNav[item].style.color = currentTheme.font_color;
		aTagInSiteNav[item].addEventListener("mouseover",siteNavHover);
		aTagInSiteNav[item].addEventListener("mouseleave",siteNavLeave);
	}
	
	// 修改著名站点导航部分的边框和文字的颜色。
	var famousSite = document.getElementsByClassName("main-famous-site")[0];
	famousSite.style.borderColor = currentTheme.theme_color;
	famousSite.style.backgroundColor = currentTheme.bg_color;
	var aTagInFamouseSite = famousSite.getElementsByTagName("a");
	for (var item = 0 ; item < aTagInFamouseSite.length; item++){
		aTagInFamouseSite[item].style.color = currentTheme.font_color;
	}
	
	// 修改侧边栏，顶部幻灯片的颜色
	var sideBarBanner = document.getElementsByClassName("side-bar-top-banner")[0];
	sideBarBanner.style.borderColor = currentTheme.theme_color;
	sideBarBanner.style.backgroundColor = currentTheme.bg_color;
	var aTagInSideBarBanner = sideBarBanner.getElementsByTagName("a");
	for (var item = 0 ; item < aTagInSideBarBanner.length; item++){
		aTagInSideBarBanner[item].style.color = currentTheme.font_color;
	}
	
	// 修改侧边栏，顶部开始导航条的颜色
	var sideStarBar = document.getElementsByClassName("side-bar-star-bar")[0];
	sideStarBar.style.borderColor = currentTheme.theme_color;
	sideStarBar.style.backgroundColor = currentTheme.bg_color;
	var aTagInSideStarBar = sideStarBar.getElementsByTagName("a");
	for (var item = 0 ; item < aTagInSideStarBar.length; item++){
		aTagInSideStarBar[item].style.color = currentTheme.font_color;
	}
}

// 改变导航栏鼠标悬停的颜色
function siteNavHover(e){
	this.style.color = currentTheme.hover_text_color;
}

// 改变导航栏鼠标离开的颜色
function siteNavLeave(e){
	this.style.color = currentTheme.font_color;
}