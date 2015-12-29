define(function (require, exports, module) {
    var html = require("./addcategory.html");
    var currentNews = {};
    
    // 初始化提交的数据。
    var postData = { "action": "", "id": "", "title": ""};

    module.exports = {
        renderNew: function (container) {
            container.html(html);
            // 初始化分类列表
            $.ajax({
                url: "/common/getAllCategory.php",
                type: "GET",
                datatype: "json",
                success: renderCatList
            });

            $("#action_title").html("新增类目");
            
            // 显示模态框
            $('#addcategorymodal').modal('show');
            postData.action = "new";
            $("#category_submit_btn").on("click", submitNews);
            $("#category_message").hide();
        },

        renderModyfi: function (container, cat_id) {
            container.html(html);
            // 初始化文章
            $.ajax({
                url: "/common/getNews.php",
                type: "POST",
                datatype: "json",
                data: { "cat_id": cat_id },
                success: renderNews
            });
            
            // 初始化分类列表
            $.ajax({
                url: "/common/getAllCategory.php",
                type: "GET",
                datatype: "json",
                success: renderCatList
            });

            $("action_title").html("修改新闻");
            
            // 显示模态框
            $('#addcategorymodal').modal('show');
            postData.action = "modify";
            postData.cat_id = "cat_id";
            $("#category_submit_btn").on("click", submitNews);
            $("#category_message").hide();
        }
    };

    function submitNews() {
        postData.title = $("#category_title").val();
        var messagebox = $("#category_message"); 
        
        $.ajax({
            data: postData,
            type: "POST",
            datatype: "json",
            url: "/common/updateCategory.php",
            success: function (data) {
                if (data.status == "1") {
                    messagebox.html("出现错误！"+ data.errorcode);
                    messagebox.removeClass("alert-success");
                    messagebox.addClass("alert-danger");
                    messagebox.show();
                }
                else {
                    messagebox.html("保存成功！");
                    messagebox.removeClass("alert-danger");
                    messagebox.addClass("alert-success");
                    messagebox.show();
                }
            },
            error: function (data) {
                messagebox.html(data.responseText);
                messagebox.removeClass("alert-success");
                messagebox.addClass("alert-danger");
                messagebox.show();
            }
        });
    }

    function renderCatList(data) {
        var catListHtml = "";
        $.each(data, function (index, item) {
            catListHtml +='<span class="label label-primary">'+ item.title +'</span> ';
        });
        $(".category-list").html(catListHtml);
    }

    function renderCategory(data) {
        $.each(data, function (index, item) {
            $("#news_title").val(item.title);
            $("#editor").html(item.content);
            $("#news_cat").html(item.cat_title);
            postData.news_id = item.id;
            currentNews = item;
        });
    }
});