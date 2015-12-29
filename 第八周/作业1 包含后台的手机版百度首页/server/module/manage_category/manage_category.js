define(function (require, exports, module) {

    var moduleCategory = require("../addcategory/addcategory");

    module.exports = {
        render: function (container) {
            var html = require("./manage_category.html");
            container.html(html);
            renderPlanes($("#category_planeitems"));

            $("#addNews").on("click", function (e) {
                moduleCategory.renderNew($("#category_modalView"));
            });
        }
    };

    function renderPlanes(container) {
        $.ajax({
            url: "/common/getAllCategory.php",
            datatype: "text",
            type: "get",
            success: parsResult,
            error: function (data) {
                $("#category_planeitems").html(data.responseText);
            }
        });
    }
    
    function parsResult(data) {
        $("#category_planeitems").html(data);
        var planeItemString = '<div class="col-md-3 col-xs-6"><div class="planeitem plane-red"><div class="planetitle">[title]</div><div class="planevalue">[newsCount]</div>篇新闻</div></div>';
        $.each(data, function (index, item) {
            var itemString = planeItemString.replace("[title]", "类目:" + item["title"]);
            itemString = itemString.replace("[newsCount]", item["newsCount"]);
            $(itemString).appendTo("#category_planeitems");
        });
    }
});