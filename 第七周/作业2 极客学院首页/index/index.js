define(function(require,exports,module){
	var header = require("./page_header/header");
	header.render("#header");
	
	var nav = require("./page_nav/nav");
	nav.render("#nav");
	
	var knowledge = require("./page_knowledge/knowledge");
	knowledge.render("#knowledge");
	
	var career = require("./page_career/career");
	career.render("#career");
	
	var intro = require("./page_intro/intro");
	intro.render("#intro");
	
	var course = require("./page_course/course");
	course.render("#course");
	
	var special = require("./page_special/special");
	special.render("#special");
	
	var footer = require("./page_footer/footer");
	footer.render("#footer");
	
	var wiki = require("./page_wiki/wiki");
	wiki.render("#wiki");
});