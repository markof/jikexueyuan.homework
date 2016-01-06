<?php
header("Content-Type: text/json;charset=UTF-8");
include "./dboperate.inc.php";

// 初始化将要返回的json结果。
$json_result = array();

$action = $_POST["action"];

// 判断操作的种类
switch ($action) {
    case 'new':
        addCategory();
        break;
    case 'modify':
        modifyCategory();
        break;
    case 'delete':
        deleteCategory();
        break;
}

function deleteCategory(){
    global $json_result;
    $category_id = $_POST["id"];
    $db = new database();
    
    if (is_null($category_id) or $category_id==""){
        $json_result["status"] = constant("JSONERROR");
        $json_result["errorcode"] = "修改新闻，参数不全。";
    }
    else{
        if($db->deleteCategory($category_id)){
            $json_result["status"] = constant("JSONSUCCESS");
            $json_result["errorcode"] = "";
        }
        else{
            $json_result["status"] = constant("JSONERROR");
            $json_result["errorcode"] = "未知错误";
        }
    }
}

function modifyCategory(){
    global $json_result;
    $category_id = $_POST["id"];
    $category_title = $_POST["title"];
    $db = new database();
    
    if (is_null($category_id) or is_null($category_title)){
        $json_result["status"] = constant("JSONERROR");
        $json_result["errorcode"] = "修改新闻，参数不全。";
    }
    else{
        $db->modifyCategory($category_id,$category_title);
        $json_result["status"] = constant("JSONSUCCESS");
        $json_result["errorcode"] = "";
    }
}

function addCategory(){
    global $json_result;
    $category_title = $_POST["title"];
    $db = new database();
    
    if ($ifExist = $db->isCategoryExist($category_title)){
        $row = $ifExist->fetch_assoc();
        if ($row["ifExist"]=="1"){
            $json_result["status"] = constant("JSONERROR");
            $json_result["errorcode"] = "同样的分类已经存在，请勿重复提交。";
        }
        else{
            if (is_null($category_title) or $category_title==""){
                $json_result["status"] = constant("JSONERROR");
                $json_result["errorcode"] = "新增类目，参数不全。";
            }
            else{
                if ($db->addCategory($category_title)){
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