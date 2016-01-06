<?php 
header("Content-Type: text/json;charset=UTF-8");
include "./dboperate.inc.php";

// 初始化将要返回的json结果。
$json_result = array();

$action = $_POST["action"];

// 判断操作的种类
switch ($action) {
    case 'new':
        addNews();
        break;
    case 'modify':
        modifyNews();
        break;
    case 'delete':
        deleteNews();
        break;
}

function deleteNews(){
    global $json_result;
    $news_id = $_POST["news_id"];
    $db = new database();
    
    if (is_null($news_id) or $news_id ==""){
        $json_result["status"] = constant("JSONERROR");
        $json_result["errorcode"] = "删除新闻，参数不全。";
    }
    else{
        if ($db->deleteNews($news_id)){
            $json_result["status"] = constant("JSONSUCCESS");
            $json_result["errorcode"] = "";
        }
        else{
            $json_result["status"] = constant("JSONERROR");
            $json_result["errorcode"] = "未知错误";
        }
    }
}

function modifyNews(){
    global $json_result;
    $news_id = $_POST["news_id"];
    $news_title = $_POST["title"];
    $news_content = $_POST["content"];
    $news_cat_id = $_POST["cat_id"];
    $db = new database();
    
    if (is_null($news_id) or is_null($news_title) or is_null($news_content) or is_null($news_cat_id)
        or $news_id =="" or $news_title == "" or $news_content == "" or $news_cat_id == ""){
        $json_result["status"] = constant("JSONERROR");
        $json_result["errorcode"] = "修改新闻，参数不全。";
    }
    else{
        if ($db->modifyNews($news_id,$news_title,$news_content,$news_cat_id)){
            $json_result["status"] = constant("JSONSUCCESS");
            $json_result["errorcode"] = "";
        }
        else{
            $json_result["status"] = constant("JSONERROR");
            $json_result["errorcode"] = "未知错误";
        }
    }
}

function addNews(){
    global $json_result;
    $news_title = $_POST["title"];
    $news_content = $_POST["content"];
    $news_cat_id = $_POST["cat_id"];
    $db = new database();
     
    if ($ifExist = $db->isNewsExist($news_title,$news_content,$news_cat_id)){
        $row = $ifExist->fetch_assoc();
        if ($row["ifExist"]=="1"){
            $json_result["status"] = constant("JSONERROR");
            $json_result["errorcode"] = "同样的新闻已经存在，请勿重复提交。";
        }
        else{
            if (is_null($news_title) or is_null($news_content) or is_null($news_cat_id)){
                $json_result["status"] = constant("JSONERROR");
                $json_result["errorcode"] = "新增新闻，参数不全。";
            }
            else{
                if ($db->addNews($news_title,$news_content,$news_cat_id)){
                    $json_result["status"] = constant("JSONSUCCESS");
                    $json_result["errorcode"] = "";
                }
                else{
                    $json_result["status"] = constant("JSONERROR");
                    $json_result["errorcode"] = "未知错误";
                }
            }
        }
    }
    else{
        $json_result["status"] = constant("JSONERROR");
        $json_result["errorcode"] = "未知错误";
    }
}

echo json_encode($json_result,JSON_UNESCAPED_UNICODE);
?>