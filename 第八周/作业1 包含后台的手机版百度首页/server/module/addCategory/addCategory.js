define(function (require, exports, module) {
    var html = require("./addcategory.html");
    var currentNews = {};
    var container;
    
    // 初始化提交的数据。
    var postData = { "action": "", "id": "", "title": ""};

    module.exports = {
        renderNew: function (target) {
            container = target;
            container.html(html);
            postData.action = "new";
            // 初始化分类列表
            $.ajax({
                url: "../common/getAllCategory.php",
                type: "GET",
                datatype: "json",
                success: renderCatList
            });

            $(container.selector+" .action_title").html("新增类目");
            
            // 显示模态框
            $(container.selector+' .addcategorymodal').modal('show');
            $(container.selector+" .category_submit_btn").on("click", submitCategory);
            $(container.selector+" .category_message").hide();
            
            $(container.selector+' .addcategorymodal').on("hide.bs.modal",function(){
                container.trigger("close");
            });
            
        },

        renderModyfi: function (target, cat_id) {
            container = target;
            container.html(html);
            postData.id = cat_id;
            postData.action = "modify";
            // 初始化分类列表
            $.ajax({
                url: "../common/getAllCategory.php",
                type: "GET",
                datatype: "json",
                success: renderCatList
            });

            $(container.selector+" .action_title").html("修改类目");
            
            // 显示模态框
            $(container.selector+' .addcategorymodal').modal('show');
            $(container.selector+" .category_submit_btn").on("click", submitCategory);
            $(container.selector+" .category_message").hide();
            $(container.selector+' .addcategorymodal').on("hide.bs.modal",function(){
                container.trigger("close");
            });
        }
    };

    function submitCategory() {
        postData.title = $(container.selector+" .category_title").val();
        var messagebox = $(container.selector+" .category_message"); 
        
        $.ajax({
            data: postData,
            type: "POST",
            datatype: "json",
            url: "../common/updateCategory.php",
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
            console.log(item.id + "  "  + postData.id);
            if (item.id == postData.id){
                console.log("makrof");
                $(container.selector+" .category_title").val(item.title);
            }
        });
        $(container.selector+" .category-list").html(catListHtml);
    }
});