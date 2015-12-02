define(function (require, exports, module) {
  
  // 引入必要的模块
  var html = require("./page_top_bar.html");
  require("reset-css");
  require("./page_top_bar.css");
  var weather = require("weather");

  // 导出
  module.exports = {
    // 渲染
    render: function (container) {
      $(container).append(html);
      $("#page_top_bar_weather").append(weather.getWeather().city);
      
      $()
    },
  };
});