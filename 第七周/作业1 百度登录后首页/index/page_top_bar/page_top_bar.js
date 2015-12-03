define(function (require, exports, module) {
  
  // 引入必要的模块
  var html = require("./page_top_bar.html");
  require("reset-css");
  require("./page_top_bar.css");
  var weather = require("weather");
  var theme = require("theme");

  function showSide(event){
    $("#page_side_bar_more").fadeIn(100);
    event.stopPropagation();
  }
  
  function hideSide(event){
    $("#page_side_bar_more").fadeOut(100);
    event.stopPropagation();
  }
  
  function showTheme(event){
    theme.show();
    event.stopPropagation();
  }
  
  function hideTheme(event){
    theme.hide();
    event.stopPropagation();
  }

  // 导出
  module.exports = {
    // 渲染
    render: function (container) {
      $(container).append(html);
      $("#page_top_bar_weather").append(weather.getWeather().city);
      $("#page_top_bar_more").on("mouseover",showSide);
      $("#page_side_bar_more").on("mouseover",showSide);
      $("#page_side_bar_more").on("mouseleave",hideSide);
      $("#change_theme").on("click",showTheme);
      $(document).on("click",hideTheme);
    },
  };
});