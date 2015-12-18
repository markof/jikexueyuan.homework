define(function (require, exports, module) {
  
  // 引入必要的模块
  var html = require("./page_top_bar.html");
  require("reset-css");
  require("./page_top_bar.css");
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
      
      $("#page_top_bar_more").on("mouseover",showSide);
      $("#page_side_bar_more").on("mouseover",showSide);
      $("#page_side_bar_more").on("mouseleave",hideSide);
      $("#change_theme").on("click",showTheme);
      $(document).on("click",hideTheme);
      
      theme.addNoThemeObserver(themeWhite);
      theme.addUseThemeObserver(themeBlack);
      
      GetWeatherReport();
    },
  };
  
  function themeWhite(){
    $("#page_top_bar .top-bar").removeClass("theme-black");
    $("#page_top_bar .top-bar").addClass("theme-white");
  }
  
  function themeBlack(){
    $("#page_top_bar .top-bar").removeClass("theme-white");
    $("#page_top_bar .top-bar").addClass("theme-black");
  }
  
  function GetWeatherReport(){
    window.navigator.geolocation.getCurrentPosition(function(position){
      var pos = position.coords.longitude+","+ position.coords.latitude ;
      var url = "http://api.map.baidu.com/telematics/v3/weather";
      $.ajax(url,{
        data:{
          location : pos,
          output: "json",
          ak:"CE581850502e6c81cb11cfd131d6b83c"},
        dataType:'jsonp',
        crossDomain: true,
        success: function(result){
          weatherRender(result);
        }}
      );
    },function(){
       $("#page_top_bar_weather").append("无法获取位置信息");
    });
    
    
    function weatherRender(result){
        var html = result.results[0].currentCity + ":" + result.results[0].weather_data[0].weather  +" " + result.results[0].weather_data[0].temperature + " " + pm25Level(result.results[0].pm25)+" "+ result.results[0].pm25;
        $("#page_top_bar_weather").append(html);

        var weather_data = result.results[0].weather_data;
        var brocastItem = "";
        
        for(var index=0; index < weather_data.length; index++){
          var date = index==0?"今天": weather_data[index].date;
          var temperature = weather_data[index].temperature;
          var image =  weather_data[index].dayPictureUrl;
          var wind = weather_data[index].wind;
          brocastItem += '<div class="weather-item"><span>'+ date +'</span><img src="'+ image +'" alt=""><span class="temperature">'+ temperature +'</span><span class="wind">'+ wind +'</span></div>';
        }
        
        $("#page_top_bar .tool-item .weather-brocast").append(brocastItem);
    }
    
    
    function pm25Level(value){
      var pm25 = parseInt(value);
      if (pm25<=50){return "优"};
      if (50<pm25 && pm25<=100){return "良"};
      if (100 <pm25 && pm25 <=150){return "轻度"};
      if (150 <pm25 && pm25 <=200){return "中度"};
      if (200 <pm25 && pm25 <=300){return "重度"};
      if (300 <pm25){return "严重"};
    }
  }
});