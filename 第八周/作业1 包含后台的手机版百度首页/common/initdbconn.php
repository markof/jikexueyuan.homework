<?php 
header("Content-Type: text/json;charset=UTF-8");
// 引入全局定义的内容
include_once"common.inc.php";

//获取接口参数，由于涉及到用户名，只接受POST方式。
$dbuser = $_POST["user"];
$dbserver = $_POST["server"];
$dbpwd = $_POST["password"];

// 创建一个基本对象，用于返回结果
$result = new stdClass();

// 尝试链接数据库，如果成功则记录链接信息，如果失败则返回失败的结果。
$con = mysqli_connect($dbserver,$dbuser,$dbpwd);
if (!$con){
    $result->status = constant("JSONERROR");
    $result->errorcode = mysqli_error($con);
}
else{
    // 判断配置文件是否存在
    if (file_exists(constant("CONFIGFILEPATH"))){
        $result->status = constant("JSONERROR");
        $result->errorcode = "数据库初始化失败:数据库配置文件[". constant("CONFIGFILEPATH") ."]已存在，如需要重新配置，请手动删除配置文件和数据库表[". constant("DATABASENAME") ."]"; 
    }
    else{
        // 打开conf.ini文件，用于写入配置
        $connconffile = fopen(constant("CONFIGFILEPATH"), "x");
        if (!$connconffile){
            $result->status = constant("JSONERROR");
            $result->errorcode = mysqli_error($con);
        } 
        else{
            // 设置配置文件的内容
            $initext = constant("CONNCONFIGTITLE") . "\n";
            $initext .= constant("CONNCONFIGSERVER") . "=" . $dbserver . "\n";
            $initext .= constant("CONNCONFIGUSER") . "=" . $dbuser . "\n";
            $initext .= constant("CONNCONFIGPWD") . "=" . $dbpwd . "\n";
            
            // 写入文件
            fwrite($connconffile,$initext);
            fclose($connconffile);
            
            $result->status = constant("JSONSUCCESS");
            $result->errorcode = "";
            
            // 关闭数据库
            mysqli_close($con);
        }   
    }
}

// 无论成功与否，都返回结果。
echo json_encode($result);
?>