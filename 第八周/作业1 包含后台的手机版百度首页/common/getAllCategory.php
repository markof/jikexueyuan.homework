<?php 

header("Content-Type: text/json;charset=UTF-8");
include "./dboperate.inc.php";

$db = new database();
$result = $db->getAllCategory();
$results = array();

while($row = $result->fetch_assoc()){
    array_push($results,$row);
}
echo json_encode($results,JSON_UNESCAPED_UNICODE);
?>