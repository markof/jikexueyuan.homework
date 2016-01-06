<?php 
// 引入全局定义的内容
include "common.inc.php";

// 打开配置文件并读取配置
$connconfig = parse_ini_file(constant("CONFIGFILEPATH"));
$dbserver = $connconfig["server"];
$dbuser = $connconfig["user"];
$dbpwd = $connconfig["password"];

//定义 SQL 执行的字符串
$sql_create_db = "CREATE DATABASE " . constant("DATABASENAME") . " character set utf8";
$sql_create_tb_news = "CREATE TABLE news (id INT auto_increment primary key, createdate DATETIME, modifydate DATETIME, cat_id INT, title TINYTEXT, content LONGTEXT)";
$sql_create_tb_category = "CREATE TABLE category (id INT auto_increment primary key, createdate DATETIME, modifydate DATETIME, title TINYTEXT)";
$sql_if_exsit_tb="SELECT COUNT(*) FROM information_schema.TABLES WHERE TABLE_NAME='" . constant("DATABASENAME") +"'";

$sql_create_pd_AddArtical = "
CREATE procedure addNews (in news_title TINYTEXT, in news_content LONGTEXT, in cat_ID int) 
begin 
insert into news (createdate,modifydate,cat_id,title,content) values (now(),now(),cat_ID,news_title,news_content);
end;";

$sql_create_pd_ModifyArtical = "
CREATE procedure modifyNews (in news_id int, in news_title TINYTEXT, in news_content LONGTEXT, in cat_ID int) 
begin 
update news set modifydate=now(), cat_id=cat_ID, title=news_title, content=news_content WHERE id=news_id;
end;";

$sql_create_pd_SearchArtical = "
CREATE PROCEDURE `searchNews`(in keyworks TINYTEXT, in pageNumber int , in pagesize int, out news_count int)
begin 
DECLARE pageOffset INT;
set pageOffset = pageSize * (pageNumber-1);
select news.*,category.title as cat_title from news,category
where category.id=news.cat_id and (news.title like CONCAT('%',keyworks,'%') or news.content like CONCAT('%',keyworks,'%'))
LIMIT pageOffset,pageSize;
select count(*) into news_count from news,category 
where category.id=news.cat_id and (news.title like CONCAT('%',keyworks,'%') or news.content like CONCAT('%',keyworks,'%'));
end;";

$sql_create_pd_getNewsByID = "
CREATE PROCEDURE getNewsByID(in news_id int)
begin
select news.*, category.title as cat_title from news,category
where news.id = news_id and news.cat_id = category.id;
end;";

$sql_create_pd_getNewsByPage = "
CREATE PROCEDURE getNewsByPage(in pageNumber int, in pageSize int, out news_count int)
begin
DECLARE pageOffset INT;
set pageOffset = pageSize * (pageNumber-1);
select news.*, category.title as cat_title from news,category
where news.cat_id = category.id LIMIT pageOffset,pageSize;
select IFNULL(count(news.id),0) into news_count from news;
end;";

$sql_create_pd_getNewsByCat = "
CREATE PROCEDURE getNewsByCat(in category_id int, in pageNumber int , in  pagesize int, out news_count int)
begin
DECLARE pageOffset INT;
set pageOffset = pageSize * (pageNumber-1);
select news.*, category.title as cat_title from news,category
where news.cat_id = category_id and news.cat_id = category.id
LIMIT pageOffset,pageSize;
select ifnull(count(news.id),0) into news_count from news,category 
where news.cat_id = category_id and news.cat_id = category.id group by news.cat_id;
end;";

$sql_create_pd_AddCategory = "
CREATE procedure addCategory (in cat_title TINYTEXT) 
begin 
insert into category (createdate,modifydate,title) values (now(),now(),cat_title);
end;";

$sql_create_pd_ModifyCategory = "
CREATE procedure modifyCategory (in cat_id int, in cat_title TINYTEXT) 
begin 
update category set modifydate=now(), title=cat_title WHERE id=cat_id;
end;";

$sql_create_pd_GetAllCategory = "
CREATE PROCEDURE getAllCategory()
begin
select category.*, IFNULL(subTable.newsCount, 0) as newsCount from category 
left join (select news.cat_id, count(id) as newsCount from news group by news.cat_id) as subTable
on subTable.cat_id = category.id;
end;";

$sql_create_pd_isNewsExist = "
CREATE PROCEDURE isNewsExist(in news_title TINYTEXT, in news_content LONGTEXT, in news_cat_id int)
begin
select ifnull(count(id),0) as ifExist from news where title=news_title and content=news_content and cat_id=news_cat_id;
end;";

$sql_create_pd_isCategoryExist = "
CREATE PROCEDURE isCategoryExist(in category_title TINYTEXT)
begin
select ifnull(count(id),0) as ifExist from category where title=category_title;
end;";

// 用于向客户端吐出即时数据。
function FlashMessage($message){
    echo($message);
    ob_flush();
    flush();
}

// 链接数据库并准备进行数据库配置
FlashMessage("尝试链接数据库...<br>");
$con = mysqli_connect($dbserver,$dbuser,$dbpwd);
if (!$con){
    FlashMessage("数据库链接失败。<br>");
    FlashMessage(mysqli_error()."<br>");
}
else{
    FlashMessage("数据库链接成功。<br>");
    FlashMessage("尝试创建数据库[". constant("DATABASENAME") ."]...<br>");
    // 检查数据库是否已经存在
    if (mysqli_query($con, $sql_if_exsit_tb)){
        FlashMessage("创建数据库失败，数据库[". constant("DATABASENAME") ."]已存在。<br>");
    }
    else{
        // 创建数据库
        if(!mysqli_query($con,$sql_create_db)){
            FlashMessage("创建数据库失败<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("数据库创建成功。<br>");
        }
        
        // 使用已创建的数据库
        if (!mysqli_select_db($con, constant("DATABASENAME"))){
            FlashMessage("无法使用数据库[". constant("DATABASENAME") ."]<br>");
        }
        
        // 创建新闻表
        FlashMessage("尝试建立数据表[news]...<br>");
        if (!mysqli_query($con,$sql_create_tb_news)){
            FlashMessage("数据表建立失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("数据表建立成功。<br>");
        }
        
        // 创建分类表
        FlashMessage("尝试建立数据表[category]...<br>");
        if (!mysqli_query($con,$sql_create_tb_category)){
            FlashMessage("数据表建立失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("数据表建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[AddArtical]...<br>");
        if (!mysqli_query($con,$sql_create_pd_AddArtical)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[ModifyArtical]...<br>");
        if (!mysqli_query($con,$sql_create_pd_ModifyArtical)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[SearchArtical]...<br>");
        if (!mysqli_query($con,$sql_create_pd_SearchArtical)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[AddCategory]...<br>");
        if (!mysqli_query($con,$sql_create_pd_AddCategory)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[ModifyCategory]...<br>");
        if (!mysqli_query($con,$sql_create_pd_ModifyCategory)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[GetAllCategory]...<br>");
        if (!mysqli_query($con,$sql_create_pd_GetAllCategory)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[getNewsByID]...<br>");
        if (!mysqli_query($con,$sql_create_pd_getNewsByID)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[getNewsByCat]...<br>");
        if (!mysqli_query($con,$sql_create_pd_getNewsByCat)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[getNewsByPage]...<br>");
        if (!mysqli_query($con,$sql_create_pd_getNewsByPage)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[isNewsExist]...<br>");
        if (!mysqli_query($con,$sql_create_pd_isNewsExist)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
        
        // 创建procedure
        FlashMessage("尝试创建过程[isCategoryExist]...<br>");
        if (!mysqli_query($con,$sql_create_pd_isCategoryExist)){
            FlashMessage("过程创建失败。<br>");
            FlashMessage(mysqli_error($con)."<br>");
        }
        else{
            FlashMessage("过程建立成功。<br>");
        }
    }
}

// 关闭数据库
mysqli_close($con);
?>