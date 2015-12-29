define(function (require, exports, module) {
    var html = require("./addnews.html");
    var currentNews = {};

    var mycontainer;
    
    // 初始化提交的数据。
    var postData = { "action": "", "news_id": "", "title": "", "content": "", "cat_id": "" };

    module.exports = {
        renderNew: function (target) {
            mycontainer = target;
            mycontainer.html(html);
            // 初始化分类列表
            $.ajax({
                url: "/common/getAllCategory.php",
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
        },

        renderModify: function (target, news_id) {
            mycontainer = target;
            mycontainer.html(html);
            // 初始化文章
            $.ajax({
                url: "/common/getNews.php",
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
                url: "/common/getAllCategory.php",
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
        }
    };

    function submitNews() {
        postData.title = $(mycontainer.selector + " .addnewsmodal .news_title").val();
        postData.content = $(mycontainer.selector + ' .editor').html();
        var messagebox = $(mycontainer.selector + " .addnewsmodal .news_message");
        $.ajax({
            data: postData,
            type: "POST",
            datatype: "json",
            url: "/common/updateNews.php",
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