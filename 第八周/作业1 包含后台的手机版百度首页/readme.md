##使用前注意
因为涉及到数据库初始化的操作，需要保存数据库链接信息到文件，因此请保证common文件夹具有可写权限。保存的文件，请参见下面的数据库的说明部分。

##开发环境
###软件版本
|软件|操作系统|Apache|PHP|MySql|
|---|---|---|---|---|
|版本|OS X 10.11.2|Apache/2.4.16 (Unix)|PHP 5.5.30|


##网站结构
root  
|---server 保存了后端的代码首页为index.html. 这里没有做用户登录，为了方便老师查看作业。  
&nbsp;&nbsp;&nbsp;&nbsp;|---css  
&nbsp;&nbsp;&nbsp;&nbsp;|---fonts  
&nbsp;&nbsp;&nbsp;&nbsp;|---img 此处的img保存的是后台界面使用的img  
&nbsp;&nbsp;&nbsp;&nbsp;|---js  
&nbsp;&nbsp;&nbsp;&nbsp;|---php    
|---front 保存了前端的代码，首页为index.html  
&nbsp;&nbsp;&nbsp;&nbsp;|---css    
&nbsp;&nbsp;&nbsp;&nbsp;|---fonts    
&nbsp;&nbsp;&nbsp;&nbsp;|---img 此处保存的img是前端的外观图像，内容图像保存在root/img下    
&nbsp;&nbsp;&nbsp;&nbsp;|---js    
&nbsp;&nbsp;&nbsp;&nbsp;|---php    
|---common 保存了公用的PHP代码  
&nbsp;&nbsp;&nbsp;&nbsp;|---database  
|---img 保存新闻所使用的图像


##2.数据库
系统自带数据库初始化模块，在server/index.html中有链接。  
需要用户输入数据库链接IP，用户名，密码，然后系统会保存上述信息到本地文件中。  
请确保有写入权限; 如担心，可将common/conf.ini文件删除即可。  
数据库名称可以配置，配置文件在common/common.inc.php;



###表设计
####1.文章表  

|ID|创建日期|最后一次修改日期|分类|标题|正文|
|---|---|---|---|---|---|---|
|数据库唯一ID自生成|文章第一次创建时间，数据库生成|保存最后一次修改的时间|文章所属的分类|文章的标题|文章正文的饿HTML|  

####2.分类表   

|分类ID|创建日期|最后一次修改日期|标题|
|---|---|---|---|
|数据库唯一ID自生成|分类第一次创建时间|最后一次修改的时间|分类名称|

####3.Procedure设计  
1) AddArtical 添加文章,输入文章分类ID，来源，标题，正文。  
2) ModifyArtical 修改文章，输入文章分类ID，来源，标题，正文。    
4) SearchArtical 通过title和content搜索文章，返回文章所有信息。  
5) AddCategory 创建分类，输入分类标题。  
6) ModifyCategory 修改分类，输入分类标题。
8) GetCategoryByID 得到class信息，输入分类ID。返回分类的信息和该分类下的文章数量。
9) GetAllCategory 获取所有class信息。返回分类的信息和该分类下的文章数量。  

