/**
 * @author:markof
 * @update:2016.1.10
 * @description:
 * orm模型定义和工具
 */
'use strict';

// 新闻orm模型定义
const module_news = {'name':'news','module':{
    'id':           { type: 'serial', key: true, require: true },
    'title':        { type: 'text', require: true },
    'content':      { type: 'text', big: true },
    'createTime':   { type: 'date', time: true },
    'cat_title':    { type: 'text', require: true},
}};

// 类目orm模型定义
const module_category = {'name':'category','module':{
    'id':           { type: 'serial', key: true, require: true },
    'title':        { type: 'text', require: true },
    'createTime':   { type: 'date', time: true },
    'news_count':   { type: 'number', require: true }
}};

let news,category;

// 导出接口
module.exports = {
    'init':moduleInit,
    'news':function(){return news},
    'category':function(){return category},
    'emptyNews':function(){
        let date = new Date();
        let dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+ ':'+date.getMinutes()+':'+date.getSeconds();
        return {'title':'','content':'','createTime':dateString,'cat_title':''};},
    'emptyCategory':function(){
        let date = new Date();
        let dateString = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+ ':'+date.getMinutes()+':'+date.getSeconds();
        return {'title':'','createTime':dateString,'news_count':0};
    },
}

function moduleInit(database){
    category = database.define(module_category.name,module_category.module);
    news = database.define(module_news.name,module_news.module);
    news.hasOne('category',category,{},{reverse: 'news', autoFetch:true});
}
