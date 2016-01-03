<?php 
// 获取文章信息，接受参数。
// news_id 获取指定新闻信息的信息，传入新闻的ID。
// cat_id 获取某一类目下的所有文章，传入分类ID。
// keywords 获取包含指定关键字的文章，传入关键字信息。
// 使用GET方法。以上参数优先级有依次降低。
header("Content-Type: text/json;charset=UTF-8");
include("./dboperate.inc.php");

$action = $_GET["action"];
$results = new stdClass();

if($action == "news_id"){
    $news_id = $_GET["news_id"];
    $db = new database();
    $result = $db->getNewsByID($news_id);
    echo json_encode($result);
}

if($action == "category"){
    $cat_id = $_GET["cat_id"];
    $pageNumber = $_GET["pageNumber"];
    $db = new database();
    $result = $db->getNewsByCat($cat_id,$pageNumber);
    echo json_encode($result);
}

if($action == "keywords"){
    $keywords = $_GET["keywords"];
    $pageNumber = $_GET["pageNumber"];
    $db = new database();
    $result = $db->getNewsByKeywords($keywords,$pageNumber);
    echo json_encode($result);
}

if($action == "page"){
    $pageNumber = $_GET["pageNumber"];
    $db = new database();
    $result = $db->getNewsByPage($pageNumber);
    echo json_encode($result);
}
?>