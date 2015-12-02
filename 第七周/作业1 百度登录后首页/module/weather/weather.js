define(function(require, exports, module) {
	console.log("this is weather module.");
	module.exports = {
    // 渲染
    getWeather: function () {
      return {city:"bejing"};
    },
  };
});