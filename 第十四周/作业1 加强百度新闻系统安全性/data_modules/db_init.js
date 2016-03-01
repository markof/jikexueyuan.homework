/**
 * @author:markof
 * @update:2016.1.10
 * @description:
 * 新闻数据库交互的中间件,用于对数据库初始化，保存数据库连接配置。
 */
'use strict';

// 获取必要的模块
const orm = require('orm');
const fs = require('fs');
const config = require('./sys_config');
const db_module = require('./db_module');

// 导出接口
module.exports = {
    'init': init
};

// 初始化数据库的连接配置。
function init(server, usr, pwd, callback) {
    // 使用入参尝试连接数据库 
    let conobj = { 'usr': usr, 'pwd': pwd, 'server': server, 'db_name': config.db_name };
    
    // 创建数据库
    creatDatabase(conobj, function (create_db_err) {
        if (create_db_err) callback(create_db_err);
        else {
            // 用orm方式连接数据库
            conn(conobj, function (db_conn_err, database) {
                if (db_conn_err) callback(db_conn_err);
                else {
                    // 用orm方式创建数据表
                    createModule(database, function (create_module_err) {
                        if (create_module_err) callback(create_module_err);
                        else {
                            // 保存连接配置
                            saveConfig(conobj, function (config_save_err) {
                                callback(config_save_err);
                            });
                        }
                    });
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

// 保存数据库连接配置
function saveConfig(conobj, callback) {
    let saveobj = '{"usr":"' + conobj.usr + '","pwd":"' + conobj.pwd + '","server":"' + conobj.server + '","db_name":"' + conobj.db_name + '"}';
    fs.writeFile(config.config_file, saveobj, 'utf8', function (err) {
        callback(err);
    });
}

// 创建数据库
function creatDatabase(conobj, callback) {
    // 为了能够创建数据库，不得已而引用
    let mysql = require('mysql');
    
    // 设置连接参数
    let connection = mysql.createConnection({
        host: conobj.server,
        user: conobj.usr,
        password: conobj.pwd
    });
    connection.connect();
    // 执行创建数据库
    connection.query('CREATE DATABASE ' + conobj.db_name + ' character set utf8', function (err) {
        callback(err);
    });

    connection.end();
}

// 数据表重建，请慎用。
function createModule(database, callback) {   
    // 初始化数据模型
    db_module.init(database);
                            
    // 与数据库同步
    database.sync(function (err) {
        callback(err);
    });
}