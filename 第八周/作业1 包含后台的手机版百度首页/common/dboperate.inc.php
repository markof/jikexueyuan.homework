<?php 
include_once("common.inc.php");

class database{    
    // 构建函数，读取配置，建立数据库链接，这里是读取文件，可以讲链接信息保存在服务器变量中，以提高性能。
    public function __construct(){
        $connconfig = parse_ini_file(constant("CONFIGFILEPATH"));
        $dbserver = $connconfig["server"];
        $dbuser = $connconfig["user"];
        $dbpwd = $connconfig["password"];
        $dbname = constant("DATABASENAME");
        $this->conn = mysqli_connect($dbserver,$dbuser,$dbpwd,$dbname);
        mysqli_set_charset( $this->conn, 'utf8' );
        $this->result = new stdClass();
        $this->result->queryResult = array();
        $this->result->pageCount = 0;
    }
    
    //析构函数，解除数据库链接
    public function __destruct(){
        mysqli_close($this->conn);
    }
        
    // 获取所有的分类信息
    public function getAllCategory(){
        $sql = "call getAllCategory();";
        $result = mysqli_query($this->conn,$sql);
        return $result;
    }
    
    // 删除文章，通过文章id
    public function deleteNews($news_id){
        $sql = "delete from news where news.id = ". $news_id;
        $queryResult = mysqli_query($this->conn,$sql);
        return $queryResult;
    }
    
    // 删除分类，通过分类ID
    public function deleteCategory($cat_id){
        $sql = "delete from category where category.id = ". $cat_id;
        $queryResult = mysqli_query($this->conn,$sql);
        return $queryResult;
    }
    
    // 获取新闻，通过页码
    public function getNewsByPage($pageNumber){ 
        $sql = "call getNewsByPage(". $pageNumber .",". constant("NEWSPAGESIZE") .",@news_count)";
        $queryResult = mysqli_query($this->conn,$sql);
        while($row = $queryResult->fetch_assoc()){
            array_push($this->result->queryResult, $row);
        }
        $queryResult->close();
        $this->conn->next_result();
        $itemCountResult = mysqli_query($this->conn,"select IFNULL(@news_count,0) as news_count");
        while($row = $itemCountResult->fetch_assoc()){
            $this->result->itemCount = $row["news_count"];
            $this->result->pageCount = ceil($this->result->itemCount/constant("NEWSPAGESIZE"));
        }
        return $this->result;
    }
    
    // 获取新闻，通过新闻id
    public function getNewsByID($id){        
        $sql = "call getNewsByID(". $id .")";
        $queryResult = mysqli_query($this->conn,$sql);
        while($row = $queryResult->fetch_assoc()){
            array_push($this->result->queryResult, $row);
        }
        $this->result->itemCount = 1;
        $this->result->pageCount = 1;
        return $this->result;
    }
    
    // 获取新闻，通过类别信息
    public function getNewsByCat($id,$pageNumber){
        $sql = "call getNewsByCat(". $id .",". $pageNumber .",". constant("NEWSPAGESIZE") .",@news_count)";
        $queryResult = mysqli_query($this->conn,$sql);
        while($row = $queryResult->fetch_assoc()){
            array_push($this->result->queryResult, $row);
        }
        $queryResult->close();
        $this->conn->next_result();
        $itemCountResult = mysqli_query($this->conn,"select IFNULL(@news_count,0) as news_count");
        while($row = $itemCountResult->fetch_assoc()){
            $this->result->itemCount = $row["news_count"];
            $this->result->pageCount = ceil($this->result->itemCount/constant("NEWSPAGESIZE"));
        }
        return $this->result;
    }
    
    // 获取新闻，通过关键字
    public function getNewsByKeywords($keywords,$pageNumber){
        $sql = "call searchNews('". htmlentities($keywords) ."',". $pageNumber .",". constant("NEWSPAGESIZE") .",@news_count)";
        $queryResult = mysqli_query($this->conn,$sql);
        while($row = $queryResult->fetch_assoc()){
            array_push($this->result->queryResult, $row);
        }
        $queryResult->close();
        $this->conn->next_result();
        $itemCountResult = mysqli_query($this->conn,"select IFNULL(@news_count,0) as news_count");
        while($row = $itemCountResult->fetch_assoc()){
            $this->result->itemCount = $row["news_count"];
            $this->result->pageCount = ceil($this->result->itemCount/constant("NEWSPAGESIZE"));
        }
        return $this->result;
    }
    
    // 新增新闻
    public function addNews($news_title, $news_content, $news_cat_id){
        $this->conn->next_result();
        $sql = "call addNews('". $news_title ."','". $news_content ."',". $news_cat_id.")";
        $result = mysqli_query($this->conn,$sql);
        echo mysqli_error($this->conn);
        return $result;
    }
    
    // 修改新闻
    public function modifyNews($news_id ,$news_title, $news_content, $news_cat_id){
        $sql = "call modifyNews(". $news_id .",'". $news_title ."','". $news_content ."',". $news_cat_id .")";
        $result = mysqli_query($this->conn,$sql);
        return $result;
    }
    
    // 新增分类
    public function addCategory($cat_title){
        $this->conn->next_result();
        $sql = "call addCategory('". $cat_title ."')";
        $result = mysqli_query($this->conn,$sql);
        return $result;
    }
    
    // 修改分类
    public function modifyCategory($cat_id ,$cat_title){
        $sql = "call modifyCategory(". $cat_id .",'". $cat_title."')";
        $result = mysqli_query($this->conn,$sql);
        return $result;
    }
    
    // 判断新闻是否存在
    public function isNewsExist($news_title , $news_content, $news_cat_id){
        $sql = "call isNewsExist('". $news_title ."','".$news_content."',".$news_cat_id.")";
        $result = mysqli_query($this->conn,$sql);
        return $result;
    }
    
    // 判断分类是否存在
    public function isCategoryExist($cat_title){
        $sql = "call isCategoryExist('".$cat_title."')";
        $result = mysqli_query($this->conn,$sql);
        return $result;
    }
}
?>