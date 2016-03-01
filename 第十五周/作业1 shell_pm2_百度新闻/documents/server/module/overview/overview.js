define(function (require, exports, module) {
    
    var moduleNews = require("../addnews/addnews");
    
    module.exports = {
        render: function (container) {
            var html = require("./overview.html");
            container.html(html);
            renderPlanes($("#overview_planeitems"));

            $("#overview_addNews").on("click",function(e){
                moduleNews.renderNew($("#overview_modalView"));
            });
            
            $("#overview_modalView").on("close",function(){
                $("#overview_planeitems").html("");
                renderPlanes();
            })
        }
    };

    function renderPlanes() {
        $.ajax({
            url: "/api/category/categories",
            datatype: "json",
            type: "get",
            success: parsResult,
            error: function (data) {
                $("#overview_planeitems").html(data.responseText);
            }
        })
    }

    function parsResult(data) {
        var planeItemString = '<div class="col-md-3 col-xs-6"><div class="planeitem plane-red"><div class="planetitle">[title]</div><div class="planevalue">[newsCount]</div>篇新闻</div></div>';
        $.each(data, function (index, item) {
            var itemString = planeItemString.replace("[title]", "类目:" + item["title"]);
            itemString = itemString.replace("[newsCount]", item["newsCount"]);
            $(itemString).appendTo("#overview_planeitems");
        });
    }
});