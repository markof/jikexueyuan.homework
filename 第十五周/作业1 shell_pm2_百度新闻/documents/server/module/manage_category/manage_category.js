define(function (require, exports, module) {

    var moduleCategory = require("../addcategory/addcategory");

    module.exports = {
        render: function (container) {
            var html = require("./manage_category.html");
            container.html(html);
            renderPlanes($("#category_planeitems"));

            $("#manage_category_addbtn").on("click", function (e) {
                moduleCategory.renderNew($("#category_modalView"));
            });
            
            $("#category_modalView").on("close",function(){
                $("#category_planeitems").html("");
                renderPlanes($("#category_planeitems"));
            })
        }
    };

    function renderPlanes(container) {
        $.ajax({
            url: "/api/category/categories",
            datatype: "json",
            type: "get",
            success: parsResult,
            error: function (data) {
                $("#category_planeitems").html(data.responseText);
            }
        });
    }

    function deleteCategory(cat_id, target) {
        if ($(target.find(".planevalue")).html() !== "0") {
            alert("该类目下还有新闻存在，不能删除。请先清空该类目下所有新闻后，再进行删除操作。");
        } else {
            if (confirm("确认要删除该类目？")) {
                $.ajax({
                    url: "/api/category/update",
                    datatype: "json",
                    type: "POST",
                    data: { "id": cat_id, "action": "delete" },
                    success: function (data) {
                        if (data.status == "0") {
                            target.replaceWith("");
                        }
                        else {
                            $("#category_planeitems").html(data.errorcode);
                        }
                    },
                    error: function (data) {
                        $("#category_planeitems").html(data.responseText);
                    }
                });
            }
        }
    }

    function parsResult(data) {
        $("#category_planeitems").html(data);
        var planeHolder = '<div class="col-md-3 col-xs-6"></div>'
        var planeItem = '<div class="planeitem plane-red"></div>';
        var planeTitle = '<div class="planetitle">[title]</div>';
        var PlaneValue = '<div class="planevalue">[newsCount]</div><span>篇新闻</span>';
        var PlaneOp = '<div class="row plane-op"><div class="col-xs-6"><div class="btn btn-primary btn-block btn-modify" data-cat-id="[cat-id]">修改</div></div><div class="col-xs-6"><div class="btn btn-warning btn-block btn-delete" data-cat-id="[cat-id]">删除</div></div></div>'

        $.each(data, function (index, item) {
            var itemTitle = planeTitle.replace("[title]", "类目:" + item["title"]);
            var itemValue = PlaneValue.replace("[newsCount]", item["newsCount"]);
            var itemOp = PlaneOp.replace("[cat-id]", item["id"]);
            itemOp = itemOp.replace("[cat-id]", item["id"]);
            var tempitem = $(planeItem);
            var itemHolder = $(planeHolder);
            tempitem.append(itemTitle);
            tempitem.append(itemValue);
            tempitem.append(itemOp);
            itemHolder.append(tempitem);
            itemHolder.appendTo("#category_planeitems");
        });

        $(".btn-modify").on("click", function (e) {
            moduleCategory.renderModyfi($("#category_modalView"), $(this).attr("data-cat-id"));
        });

        $(".btn-delete").on("click", function (e) {
            deleteCategory($(this).attr("data-cat-id"), $(this).parent().parent().parent().parent());
        });
    }
});