/**
 * @author:markof
 * @update:2016.1.9
 * @description:
 * 新闻数据库交互的中间件，采用orm规范，使用nodejs-orm2组件，提供中间业务的接口。
 */
'use strict';

// 获取必要的模块
const orm = require('orm');
const fs = require('fs');
const config = require('./sys_config');
const db_module = require('./db_module');

// 模块内部的状态
let connobj = {};   //对象，保存了数据库连接参数。
let db;             //对象，用于保存数据库连接。

// 导出接口
module.exports = {
    // 模块相关接口
    'init': moduleInit,
    
    //类目相关接口
    'addCategory': addCategory,
    'getAllCategory': getAllCategory,
    'modifyCategory': modifyCategory,
    'deleteCategory':deleteCategory,
    
    //新闻相关接口
    'addNews':addNews,
    'getNewsByPage':getNewsByPage,
    'getNewsByID':getNewsByID,
    'getNewsByCat':getNewsByCat,
    'getNewsByKeywords':getNewsByKeywords,
    'modifyNews':modifyNews,
    'deleteNews':deleteNews
};

// 模块的初始化函数
function moduleInit(callback) {
    // 从文件获取参数，如果失败，则为空。通常配置文件不存在或者文件被占用。
    getConfig(function (err, data) {
        if (err) callback(err);
        else {
            // 初始化模块变量
            connobj = data;
            
            // 尝试连接数据库。
            conn(connobj, function (err, database) {
                if (err) callback(err);
                else {
                    // 初始化模块变量
                    database.settings.set('instance.cache', false);
                    db = database;
                    db_module.init(db);
                    callback(err);
                }
            });
        }
    });
}

// 连接数据库
function conn(conobj, callback) {
    let connstr = 'mysql://' + conobj.usr + ':' + conobj.pwd + '@' + conobj.server + '/' + conobj.db_name;
    orm.connect(connstr, function (err, database) {
        callback(err, database);
    });
}

// 获取数据库连接配置,优先从文件中获取配置，如果文件获取失败，则返回上次保存的数据。
function getConfig(callback) {
    fs.readFile(config.config_file, 'utf8', function (err, data) {
        let tempconnobj = connobj;
        try {
            tempconnobj = JSON.parse(data);
        } catch (err) {
            console.log('读取配置文件时出错，请检查配置文件的格式。具体请参考readme.md');
        }
        callback(err, tempconnobj);
    });
}

// 获取所有的分类信息
function getAllCategory(callback) {
    db_module.category().all(function(err,data){
        if (err) callback(err);
        else {
            let results = new Array();
            for (let index=0; index < data.length; index++){
                results.push({'id':data[index].id,'title':data[index].title,'newsCount':data[index].news.length})
            }
            callback(err, results);
        }
    });
}
    
//获取新闻，通过页码
function getNewsByPage(pageNumber,callback) { 
    newsFinder({},pageNumber,callback);
}
    
//获取新闻，通过新闻id
function getNewsByID(id, callback) {
    newsFinder({'id':id},1,callback);
 }
    
//获取新闻，通过类别信息
function getNewsByCat(id, pageNumber, callback) {
    newsFinder({'category_id':id},pageNumber,callback);
 }
    
//获取新闻，通过关键字
function getNewsByKeywords(keywords, pageNumber, callback) { 
    newsFinder({'title': orm.like("%"+keywords+"%")},pageNumber,callback);
}

function newsFinder(condition , page , callback){
    db_module.news().find(condition,{'offset': (page-1)*config.page_size},config.page_size,function(err,data){
        if (err){callback(err);return;}
        let results = {'pageCount':0,'queryResult':[]};
        for(let index = 0; index< data.length; index++){
            results.queryResult.push({'id':data[index].id,'cat_id':data[index].category.id,'content':data[index].content,'title':data[index].title,'cat_title': data[index].category.title ,'createTime':data[index].createTime});
        }
        db_module.news().count(condition,function(err,count){
            if (err) {callback(err);return;}
            results.pageCount = Math.ceil(count/config.page_size);
            callback(err, results);
        });
    });
}
    
//新增新闻
function addNews(news_title, news_content, news_cat_id, callback) {
    isNewsExist(news_title,news_content,news_cat_id,function(err, isExist){
        if (err) callback(err);
        else {
            if (isExist) {
                let news_exist_err = new Error("相同新闻已经存在");
                callback(news_exist_err);
            }
            else {
                // 找到所属的类目对象
                db_module.category().get(news_cat_id,function(find_cat_err,category){
                    if (find_cat_err) callback(find_cat_err);
                    else {
                        // 创建新的新闻对象，并保存到数据库中
                        let newsItem = db_module.emptyNews();
                        newsItem.title = news_title;
                        newsItem.content = news_content;
                        newsItem.cat_title = category.title;
                        db_module.news().create(newsItem,function(create_news_err,news){
                            if (create_news_err) callback(create_news_err);
                            else{
                                news.setCategory(category,function(cat_cassociate_news_err){
                                    callback(cat_cassociate_news_err);
                                });
                            }
                        });
                    }
                });
            }
        }
    });
}

//新增分类
function addCategory(cat_title,callback) {
    isCategoryExist(cat_title,function(err, isExist){
        if (err) callback(err);
        else {
            if (isExist){
                let cat_exist_err = new Error("相同类目已经存在");
                callback(cat_exist_err);
            }
            else {
                let categoryItem = db_module.emptyCategory();
                categoryItem.title = cat_title;
                // 创建分类
                db_module.category().create(categoryItem,function(err){
                callback(err);
                });
            }
        }
    });
}
    
//修改新闻
function modifyNews(news_id, news_title, news_content, news_cat_id, callback) { 
    // 得到要修改的新闻
    db_module.news().get(news_id, function (news_get_err, news) {
        if (news_get_err) {callback(news_get_err);return;}
        
        // 获得指定的类目，该类目为用户选择
        db_module.category().get(news_cat_id,function(cat_get_err,category){
            if (cat_get_err) callback(cat_get_err);
            else {
                // 修改新闻内容
                news.title = news_title;
                news.content = news_content;
                news.cat_title = category.title;
                
                // 保存到数据库
                news.save(function(news_save_err){
                    if (news_save_err) {callback(news_save_err);return;}
                    
                    // 设置类目与新闻关系
                    news.setCategory(category,function(cat_cassociate_news_err){
                        callback(cat_cassociate_news_err);
                    });
                });
            }
        });
    });    
}
    
//修改分类
function modifyCategory(cat_id, cat_title, callback) { 
    db_module.category().get(cat_id, function (cat_get_err, category) {
        if (cat_get_err) callback(cat_get_err);
        else {
            category.save({ 'title': cat_title }, function (cat_save_err) {
                callback(cat_save_err);
            });
        }
    });
}
    
// 判断新闻是否存在
function isNewsExist(news_title, news_content, news_cat_id,callback) {
    db_module.news().exists({'title':news_title,'content':news_content,'category_id':news_cat_id},function(err, isExist){
        if (err) callback(err);
        else callback(err, isExist);
    });
}
    
// 判断分类是否存在
function isCategoryExist(cat_title , callback) {
    db_module.news().exists({'title':cat_title},function(err, isExist){
        if (err) callback(err);
        else callback(err, isExist);
    });
}

//删除分类，通过分类ID
function deleteCategory(cat_id, callback) { 
    db_module.category().get(cat_id, function (cat_get_err, category) {
        if (cat_get_err) callback(cat_get_err);
        else {
            if (category.news.length != 0){
                let del_cat_err = new Error('category {id:'+ category.id +',title:'+ category.title +'} still have news, please delete al new under this category befor delete this category');
                callback(del_cat_err);
            }
            else {
                category.remove(function(cat_remove_err){
                   callback(cat_remove_err) 
                });
            }
        }
    });
}

//删除文章，通过文章id
function deleteNews(news_id, callback) {
    db_module.news().get(news_id, function(news_get_err,news){
        if (news_get_err) {callback(news_get_err);return;}
        news.remove(function(news_remove_err){
            callback(news_remove_err); 
        });
    });   
}