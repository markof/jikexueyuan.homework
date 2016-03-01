/**
 * @author:markof
 * @update:2016.1.9
 * @description:
 * 服务器服务，设置服务器路由，定义数据服务接口。是整个服务器的启动文件。
 */
'use strict';

//获取依赖项
const restify = require('restify');
const dbo = require('./data_modules/db_operator');
const dbi = require('./data_modules/db_init');
const config = require('./data_modules/sys_config');

// 创建restify服务
const server = restify.createServer();
const session = require('restify-memory-session')({
        debug : true,
        ttl   : 2
    });

// referer 检查，这里只允许某一个域的访问。
function refererCheck(referer) {
    let domain = '127.0.0.1';
    let port = config.server_port;
    let regStr = '^http://' + domain + ':' + port + '/';
    let reg = new RegExp(regStr);
    return reg.test(referer);
}

// 使用query-parser来解析query string
server.use(restify.queryParser());

// 使用session管理器。
server.use(session.sessionManager)

// 使用body-parser来解析html内容。用于获取POST数据，禁止了提交文件。
server.use(restify.bodyParser({
    maxBodySize: 0,
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
}));

// 路由注册--新闻写入相关操作，包括增删改
server.post('/api/news/update/', function (req, res, next) {
    if (!refererCheck(req.headers.referer)) {
        console.log('捕获异常访问，访问源来自:' + req.headers.referer);
        return next();
    }
    
    // 新增新闻
    if (req.params.action == 'new') {
        dbo.addNews(req.params.title, req.params.content, req.params.cat_id, function (err) {
            if (err) res.send({ 'status': 1, 'errorcode': err.message });
            else res.send({ 'status': 0, 'errorcode': '' });
        });
    }
    // 修改新闻
    else if (req.params.action == 'modify') {
        dbo.modifyNews(req.params.news_id, req.params.title, req.params.content, req.params.cat_id, function (err) {
            if (err) res.send({ 'status': 1, 'errorcode': err.message });
            else res.send({ 'status': 0, 'errorcode': '' });
        });
    }
    // 删除新闻
    else if (req.params.action == 'delete') {
        dbo.deleteNews(req.params.news_id, function (err) {
            if (err) res.send({ 'status': 1, 'errorcode': err.message });
            else res.send({ 'status': 0, 'errorcode': '' });
        });
    }
    else {
        res.send({ 'status': 1, 'errorcode': '未知请求类型' });
    }
});

// 路由注册--获取新闻相关操作
server.get('/api/news/', function (req, res, next) {
    console.log(req.session);
    req.session.userid = "markof";
    
    if (!refererCheck(req.headers.referer)) {
        console.log('捕获异常访问，访问源来自:' + req.headers.referer);
        return next();
    }
    
    // 通过页码来获取新闻，目标新闻为所有新闻
    if (req.params.action == 'page') {
        dbo.getNewsByPage(req.params.pageNumber, function (err, data) {
            err ? res.send({ 'status': 1, 'errorcode': err.message }) : res.send(data);
        });
    } 
    // 通过制定分类来获取新闻
    else if (req.params.action == 'category') {
        dbo.getNewsByCat(req.params.cat_id, req.params.pageNumber, function (err, data) {
            err ? res.send({ 'status': 1, 'errorcode': err.message }) : res.send(data);
        });
    }
    // 通过关键字来查找新闻
    else if (req.params.action == 'keywords') {
        dbo.getNewsByKeywords(req.params.keywords, req.params.pageNumber, function (err, data) {
            err ? res.send({ 'status': 1, 'errorcode': err.message }) : res.send(data);
        });
    }
    // 通过新闻ID获取新闻
    else if (req.params.action == "news_id") {
        dbo.getNewsByID(req.params.news_id, function (err, data) {
            err ? res.send({ 'status': 1, 'errorcode': err.message }) : res.send(data);
        });
    }
    else {
        res.send({ 'status': 1, 'errorcode': '未知请求类型' });
    }
});

// 路由注册--获取所有类目信息
server.get('/api/category/categories', function (req, res, next) {
    
    console.log(req.session);
    
    if (!refererCheck(req.headers.referer)) {
        console.log('捕获异常访问，访问源来自:' + req.headers.referer);
        return next();
    }

    if (!refererCheck(req.headers.referer)) {
        console.log('捕获异常访问，访问源来自:' + req.headers.referer);
        return;
    }

    dbo.getAllCategory(function (err, data) {
        if (err) res.send({ 'status': 1, 'errorcode': err.message });
        else res.send(data);
    });
});

// 路由注册--类目写入相关操作，包括增删改
server.post('/api/category/update', function (req, res, next) {
    if (!refererCheck(req.headers.referer)) {
        console.log('捕获异常访问，访问源来自:' + req.headers.referer);
        return next();
    }

    if (req.params.action == 'new') {
        dbo.addCategory(req.params.title, function (err) {
            res.send(err ? { 'status': 1, 'errorcode': err.message } : { 'status': 0, 'errorcode': '' });
        });
    }
    else if (req.params.action == 'modify') {
        dbo.modifyCategory(req.params.id, req.params.title, function (err) {
            res.send(err ? { 'status': 1, 'errorcode': err.message } : { 'status': 0, 'errorcode': '' });
        });
    }
    else if (req.params.action == 'delete') {
        dbo.deleteCategory(req.params.id, function (err) {
            res.send(err ? { 'status': 1, 'errorcode': err.message } : { 'status': 0, 'errorcode': '' });
        });
    }
    else {
        res.send({ 'status': 1, 'errorcode': '未知请求类型' });
    }
});

// 路由注册-初始化数据库
server.post('/db/init', function (req, res, next) {
    dbi.init(req.params.server, req.params.user, req.params.password, function (dbi_init_err) {
        if (dbi_init_err) res.send({ 'status': 1, 'errorcode': dbi_init_err.message });
        else {
            // 当用户手动操作进行数据库初始化时，对数据库操作模块进行初始化
            dbo.init(function (dbo_init_err) {
                if (dbo_init_err) res.send({ 'status': 1, 'errorcode': dbo_init_err.message });
                else res.send({ 'status': 0, 'errorcode': '' });
            });
        }
    });
});

// 路由注册--错误页面
server.get(/\/errorpage\/{1,}.*/, restify.serveStatic({
    directory: './documents/',
}));

// 路由注册--管理后台的静态文件服务路由
server.get(/\/server\/{1,}.*/, restify.serveStatic({
    directory: './documents/',
    default: 'index.html'
}));

// 路由注册--前端的静态文件服务路由
server.get(/\/?.*/, restify.serveStatic({
    directory: './documents/client/',
    default: 'index.html'
}));

// //404跳转处理
// server.on('ResourceNotFound', function (req, res, err, next) {
//     res.redirect('/errorpage/404.html',next);
// });

// 启动服务
server.listen(config.server_port, function () {
    // 服务启动时，对数据库操作模块进行手动初始化。
    dbo.init(function (err) {
        if (err) {
            console.info(err.message);
            console.info('系统数据库链接失败，配置文件不存在或数据库链接失败。详细请参考readme.md');
        }
    });

    console.log('服务已经启动...', '端口为:[' + config.server_port + ']');
});

