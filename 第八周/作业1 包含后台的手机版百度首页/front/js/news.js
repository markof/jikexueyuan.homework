$(document).ready(function () {
    getCategory();
});

function getCategory() {
    $.ajax({
        url: "../common/getAllCategory.php",
        datatype: "json",
        type: "get",
        success: function(data){
            $.each(data,function(index, item){
                var tempitem = renderCategory(item.id, item.title);
                $(tempitem).appendTo(".nav");
                if(index == 0){
                    getNewsByCat(item.id, 1);
                    $(".nav-item").first().addClass("active");
                }
            });
            $(".nav-item").on("click", function () {
                $(".content").html("");
                $(".nav-item").removeClass("active");
                $(this).addClass("active");
                getNewsByCat($(this).attr("data-cat-id"),1);
            });
        },
        error: function (data) {
            console.log(data.responseText);
        }
    });
}

function renderCategory(cat_id, title){
    var category_Template ='<div class="nav-item col-1" data-cat-id="[id]"><div class="right-border"></div><div class="nav-item-title"><div class="title-text">[title]</div><div class="underline"></div></div></div>';
    var tempItem = category_Template.replace("[id]",cat_id);
    tempItem = tempItem.replace("[title]",title);
    return tempItem;
}

function getNewsByCat(cat_id, pageNumber) {
    $.ajax({
        url: "../common/getNews.php",
        datatype: "json",
        data: { "action": "category", "cat_id": cat_id, "pageNumber": pageNumber},
        type: "GET",
        success: function (data) {
            dataProcess(data.queryResult,pageNumber,data.pageCount);
        },
        error: function (data) {
            console.log(data.responseText);
        }
    })
}

function dataProcess(data,pageNumber,pageCount) {
    var cat_id ="";
    $.each(data, function (index, item) {
        cat_id = item.cat_id;
        var imageReg = /<img[^>]*>/g;
        var contentReg = /<[^>]*>/g;
        var images = item.content.match(imageReg);
        var item = renderNewsItem(item.id, item.title, item.content.replace(contentReg, ""), item.createdate, images);
        $(item).appendTo(".content");
    });
    
    if (pageNumber<=pageCount){
        var moreNews = $('<div class="morenews" data-cat-id="'+ cat_id +'" data-next-page="'+ (pageNumber+1) +'"><div class="more-news-btn">点击加载更多</div></div>');
        moreNews.on("click",function(){
           var nextPage = $(this).attr("data-next-page");
           var curCat = $(this).attr("data-cat-id");
           $(this).replaceWith("");
           getNewsByCat(curCat,nextPage); 
           
        });
        moreNews.appendTo(".content");
    }
}

function renderNewsItem(news_id, title, content, create_time, images) {
    var no_image_template = '<a href="#" data-id="[id]" class="news-item no-image clearfix"><div class="news-body"><div class="news-title">[title]</div><div class="news-content">[content]</div></div><div class="news-pass">[time]</div></a>';
    var one_image_template = '<a href="#" data-id="[id]" class="news-item one-image clearfix"><div class="news-image">[image]</div><div class="news-body"><div class="news-title">[title]</div><div class="news-content">[content]</div></div><div class="news-pass">[time]</div></a>';
    var three_image_template = '<a href="#" data-id="[id]" class="news-item three-image clearfix"><div class="news-title">[title]</div><div class="clearfix"><div class="news-image">[image-1]</div><div class="news-image">[image-2]</div><div class="news-image">[image-3]</div></div><div class="news-pass">[time]</div></a>';
    
    var dataGap =Date.now() - Date.parse(create_time.replace(" ","T")+"+08:00");
    var tempTime;
    if (dataGap>Number(60*60*1000*24)){
        tempTime =  (dataGap/60/60/1000/24).toFixed(0)+"天前";
    }
    else if(dataGap>Number(60*60*1000)){
        tempTime = (dataGap/60/60/1000).toFixed(0)+"小时前";
    }
    else{
        tempTime = (dataGap/60/1000).toFixed(0)+"分钟前";
    }

    var tempNewsItem;
    if (images == null || images.length == 0) {
        tempNewsItem = no_image_template.replace("[title]", title);
        tempNewsItem = tempNewsItem.replace("[content]", content);
        tempNewsItem = tempNewsItem.replace("[time]", tempTime);
        tempNewsItem = tempNewsItem.replace("[id]", news_id);
    }
    else if (images.length < 3) {
        tempNewsItem = one_image_template.replace("[title]", title);
        tempNewsItem = tempNewsItem.replace("[image]", images[0]);
        tempNewsItem = tempNewsItem.replace("[content]", content);
        tempNewsItem = tempNewsItem.replace("[time]", tempTime);
        tempNewsItem = tempNewsItem.replace("[id]", news_id);
    } else {
        tempNewsItem = three_image_template.replace("[title]", title);
        tempNewsItem = tempNewsItem.replace("[image-1]", images[0]);
        tempNewsItem = tempNewsItem.replace("[image-2]", images[1]);
        tempNewsItem = tempNewsItem.replace("[image-3]", images[2]);
        tempNewsItem = tempNewsItem.replace("[time]", tempTime);
        tempNewsItem = tempNewsItem.replace("[id]", news_id);
    }
    return tempNewsItem;
}