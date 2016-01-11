define(function (require, exports, module) {

    var html = require("./newslist.html");
    var module_news = require("../addnews/addnews");
    var container="";
    
    module.exports = {
        render: function (target, parameter) {
            container = target;
            container.html(html);
            renderNewsList(parameter,1);
        }
    };
    
    function renderPagination(parameter, pageNumber,pageCount){
        $(container.selector + " .pagination").html("");
        var pageNo = Number(pageNumber);
        if (isNaN(pageNo)){console.log("pageNumber 不是一个数字");return false};
        var startPageNumber = (pageNo-4)<1?1:pageNo-4;
        var html = '<li><a href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        for (var index=0; index < 9; index++){
            var itemClass = (pageNo==startPageNumber+index)?'class="active paginationItem"':(pageCount<startPageNumber+index)?'class="disabled paginationItem"':'class="paginationItem"';
            html+='<li '+ itemClass +' data-page-id="'+ (startPageNumber+index) +'"><a href="#">'+ (startPageNumber+index) +'</a></li>';
        }
        html+='<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        $(html).appendTo(container.selector + " .pagination");
        $(container.selector + " .paginationItem").on("click",function(){
            if ($(this).hasClass("disabled")){return;}
            var clickedPageNo = $(this).attr("data-page-id");
            renderNewsList(parameter,clickedPageNo);
        });
    }

    
    function renderNewsList(parameter,pageNumber){
        var ajaxdata={};
        switch (parameter.action){
            case "all": ajaxdata = {"action":"page","pageNumber":pageNumber};break;
            case "search": ajaxdata= {"action":"keywords","keywords":parameter.keywords,"pageNumber":pageNumber};break;
            case "cat":ajaxdata={"action":"category" ,"cat_id":parameter.cat_id,"pageNumber":pageNumber};break;
        }
        
        $.ajax({
            type:"GET",
            datatype:"json",
            url:"/api/news",
            data:ajaxdata,
            success:function(data){
                $(container.selector +" .newslist_allnews").html("");
                $.each(data.queryResult,function(index, item){
                    $('<tr><td><a class="newsModify" href="#" data-id="'+ item.id +'">'+ item.title +'<a></td><td>'+ item.cat_title +'</td><td>'+ item.createTime +'</td><td><a data-id='+ item.id +' class="newsDelete" href="#">删除</a></td></tr>').appendTo(container.selector +" .newslist_allnews");
                });
                $(container.selector +" .newslist_allnews tr td .newsModify").on("click",function(){
                    $(container.selector +" .newsllist_modalView").on("close",function(){
                        renderNewsList(parameter,pageNumber);
                    });
                    module_news.renderModify($(container.selector +" .newsllist_modalView"),$(this).attr("data-id"));
                });
                $(container.selector +" .newslist_allnews tr td .newsDelete").on("click",function(){
                    delectNews($(this).attr("data-id"),function(){
                        renderNewsList(parameter,pageNumber);
                    });
                });
                renderPagination(parameter,pageNumber,data.pageCount);
            },
            error:function(data){
                container.html(data.responseText);
            }
        });
    }
    
    function delectNews(newsID,callback){
        if (confirm("确认要删除新闻？")){
            $.ajax({
                url:"/api/news/update",
                data:{"action":"delete","news_id":newsID},
                type:"POST",
                datatype:"json",
                success:function(data){
                    if (data.status == 0){
                        $(this).parent().parent().replaceWith(" ");
                        callback();
                    }
                    else {
                        console.log(data.errorcode);
                    }
                },
                error:function(data){
                    console.log(data.responseText);
                }
            });
        }
    }
});