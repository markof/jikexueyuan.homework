define(function (require, exports, module) {

    var moduleAddNews = require("../addNews/addNews");
    var newsList = require("../newslist/newslist");

    module.exports = {
        render: function (container) {
            var html = require("./manage_news.html");
            container.html(html);

            $("#news_addNews").on("click", function (e) {
                moduleAddNews.renderNew($("#news_modalView"));
            });
            
            var parameter = {action:"all"};
            newsList.render($("#news_newslist"),parameter);
        }
    };
});