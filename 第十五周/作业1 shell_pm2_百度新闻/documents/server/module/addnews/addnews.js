define(function (require, exports, module) {
    var html = require("./addnews.html");
    var currentNews = {};

    var mycontainer;
    
    // 初始化提交的数据。
    var postData;

    module.exports = {
        renderNew: function (target) {
            mycontainer = target;
            mycontainer.html(html);
            postData = { "action": "", "news_id": "", "title": "", "content": "", "cat_id": "" };
            // 初始化分类列表
            $.ajax({
                url: "/api/category/categories",
                type: "GET",
                datatype: "json",
                success: renderCatList
            });
            
            // 初始化新闻各个框的内容
            $(mycontainer.selector + " .addnewsmodal .news_title").val("");
            $(mycontainer.selector + " .editor").html("");
            $(mycontainer.selector + " .addnewsmodal .news_cat").html("请选择新闻类目...");
            $(mycontainer.selector + " .addnewsmodal .modal-title").html("新增新闻");
            
            // 显示模态框
            initToolbarBootstrapBindings();
            $(mycontainer.selector + ' .editor').wysiwyg();
            $(mycontainer.selector + ' .addnewsmodal').modal('show');
            postData.action = "new";
            $(mycontainer.selector + " .addnewsmodal .submit_btn").on("click", submitNews);
            $(mycontainer.selector + " .addnewsmodal .news_message").hide();
            
            $(mycontainer.selector + ' .addnewsmodal').on("hide.bs.modal",function(){
                mycontainer.trigger("close");
            });
        },

        renderModify: function (target, news_id) {
            mycontainer = target;
            mycontainer.html(html);
            postData = { "action": "", "news_id":news_id, "title": "", "content": "", "cat_id": "" };
            // 初始化文章
            $.ajax({
                url: "/api/news",
                type: "GET",
                datatype: "json",
                data: { "action": "news_id", "news_id": news_id },
                success: renderNews,
                error: function (data) {
                    var messagebox = $(mycontainer.selector + " .addnewsmodal .news_message");
                    messagebox.html("出现错误！" + data.responseText);
                    messagebox.removeClass("alert-success");
                    messagebox.addClass("alert-danger");
                    messagebox.show();
                }
            });
            
            // 初始化分类列表
            $.ajax({
                url: "/api/category/categories",
                type: "GET",
                datatype: "json",
                success: renderCatList
            });

            $(mycontainer.selector + " .addnewsmodal .modal-title").html("修改新闻");
            
            // 显示模态框
            initToolbarBootstrapBindings();
            $(mycontainer.selector + " .editor").wysiwyg();
            $(mycontainer.selector + " .addnewsmodal").modal("show");
            postData.action = "modify";
            $(mycontainer.selector + " .addnewsmodal .submit_btn").on("click", submitNews);
            $(mycontainer.selector + " .addnewsmodal .news_message").hide();
            
            $(mycontainer.selector + ' .addnewsmodal').on("hide.bs.modal",function(){
                mycontainer.trigger("close");
            });
        }
    };

    // 提交新闻
    function submitNews() {
        postData.title = $(mycontainer.selector + " .addnewsmodal .news_title").val();
        postData.content = $(mycontainer.selector + ' .editor').html();
        var messagebox = $(mycontainer.selector + " .addnewsmodal .news_message");
        // 判断标题
        if(postData.title == ""){
            messagebox.html("请填写文章的标题。");
            messagebox.removeClass("alert-success");
            messagebox.addClass("alert-danger");
            messagebox.show();
            return;
        }
        // 判断分类
        if (postData.cat_id == ""){
            messagebox.html("请选择新闻的类目。");
            messagebox.removeClass("alert-success");
            messagebox.addClass("alert-danger");
            messagebox.show();
            return;
        }
        // 判断内容
        if(postData.content == ""){
            messagebox.html("新闻内容为空。");
            messagebox.removeClass("alert-success");
            messagebox.addClass("alert-danger");
            messagebox.show();
            return;
        }
        // 提交新闻
        $.ajax({
            data: postData,
            type: "POST",
            datatype: "json",
            url: "/api/news/update",
            success: function (data) {
                if (data.status == "1") {
                    messagebox.html("出现错误！" + data.errorcode);
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

    // 初始化分类选项
    function renderCatList(data) {
        var catListHtml = "";
        $.each(data, function (index, item) {
            catListHtml += "<li data-cat-id='" + item.id + "'><a href='#'>" + item.title + "</a></li>";
        });
        $(mycontainer.selector + " .addnewsmodal .category_list").html(catListHtml);
        $(mycontainer.selector + " .addnewsmodal .category_list li").on("click", function () {
            $(mycontainer.selector + " .addnewsmodal .news_cat").text($($(this).children()[0]).html());
            postData.cat_id = $(this).attr("data-cat-id");
        })
    }

    // 初始化新闻内容包括标题和分类
    function renderNews(data) {
        $.each(data.queryResult, function (index, item) {
            $(mycontainer.selector + " .addnewsmodal .news_title").val(item.title);
            $(mycontainer.selector + " .editor").html(item.content);
            $(mycontainer.selector + " .addnewsmodal .news_cat").html(item.cat_title);
            postData.news_id = item.id;
            postData.cat_id = item.cat_id;
            currentNews = item;
        });
    }

    // 新闻输入控件的工具栏初始化。 
    function initToolbarBootstrapBindings() {
        var fonts = ['Serif', 'Sans', 'Arial', 'Arial Black', 'Courier',
            'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times',
            'Times New Roman', 'Verdana'],
            fontTarget = $('[title=Font]').siblings('.dropdown-menu');
        $.each(fonts, function (idx, fontName) {
            fontTarget.append($('<li><a data-edit="fontName ' + fontName + '" style="font-family:\'' + fontName + '\'">' + fontName + '</a></li>'));
        });
        $('a[title]').tooltip({ container: 'body' });
        $('.dropdown-menu input').click(function () { return false; })
            .change(function () { $(this).parent('.dropdown-menu').siblings('.dropdown-toggle').dropdown('toggle'); })
            .keydown('esc', function () { this.value = ''; $(this).change(); });

        $('[data-role=magic-overlay]').each(function () {
            var overlay = $(this), target = $(overlay.data('target'));
            overlay.css('opacity', 0).css('position', 'absolute').offset(target.offset()).width(target.outerWidth()).height(target.outerHeight());
        });
        if ("onwebkitspeechchange" in document.createElement("input")) {
            var editorOffset = $('#editor').offset();
            $(mycontainer.selector +' .voiceBtn').css('position', 'absolute').offset({ top: editorOffset.top, left: editorOffset.left + $('#editor').innerWidth() - 35 });
        } else {
            $(mycontainer.selector +' .voiceBtn').hide();
        }
    };

});