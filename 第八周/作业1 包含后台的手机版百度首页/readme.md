##使用前注意
###数据库初始化
因为涉及到数据库初始化的操作，需要保存数据库链接信息到文件，因此请保证common文件夹具有可写权限。保存的文件，请参见下面的数据库的说明部分。  
默认新建的数据库名称为"my_db"，如果需要修改数据库名称，请在数据库初始化前，修改/common/common.inc.php 的常量 define("DATABASENAME","my_db");
###文章中的图像保存
使用了bootstrap-wysiwyg插件作为输入的文本输入器，由于该输入插件输入的图片为base64编码。这里简化后，将base64编码的图片与内容一同存进了数据库。并没有单独储存。
###前端的新闻分页
无论是展示部分的分页，还是管理部分的分页，所有的分页控制均在PHP的代码中,默认为5。这样的考虑主要是把分页作为服务器端的业务层，前端纯粹作为展示层。避免了大量数据吐向前端造成服务器和网络负担，封闭了前端随意调用的可能性，保证安全。  
如果需要修改分页，请修改/common/common.inc.php 的常量define("NEWSPAGESIZE", 5);
###front部分的新闻展示
新闻展示更具文章的图像数量不同，共有三种模板，分别为：
1. 无图像  
2. 1个图像  
3. 3个图像    

上述模板可更具文章中的图像数量不同自动匹配。  

###前后端的入口页面
请将服务的根文件夹设置为/common的父文件夹。  
后台管理页面的入口为 [localhost]/server/index.html  
手机新闻页面的入口为 [localhost]/front/index.html  

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
|---front 保存了前端的代码，首页为index.html  
&nbsp;&nbsp;&nbsp;&nbsp;|---css    
&nbsp;&nbsp;&nbsp;&nbsp;|---fonts    
&nbsp;&nbsp;&nbsp;&nbsp;|---img 此处保存的img是前端的外观图像，内容图像保存在root/img下    
&nbsp;&nbsp;&nbsp;&nbsp;|---js    
&nbsp;&nbsp;&nbsp;&nbsp;|---module  
|---common 保存了公用的PHP代码,front和server中对于数据库的操作    

##分页设计
分页设置主要由三部分组成，
1. 数据库提供限量提供数据的接口，使用LIMIT为业务层提供了控制数据库返回数据量的借口。
2. 服务器PHP代码提供分页逻辑，控制了数据库返回的数据量，和数据库获取数据的偏移量。
3. 前端部分提供分页的操作。前端调用服务器PHP代码，输入要获取数据的页码。  
 
其中，控制分页的关键参数在/common/common.inc.php文件中。define("NEWSPAGESIZE", 5);

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
数据库的操作都通过预设的procedure来进行操作。不通过直接调用sql。   
sql_create_pd_AddArtical;新增文章  
sql_create_pd_ModifyArtical; 修改文章   
sql_create_pd_SearchArtical; 通过关键字查找文章。  
sql_create_pd_getNewsByID;  通过文章ID得到文章信息。  
sql_create_pd_getNewsByPage;  通过页码获取文章。只有在获取全部文章，无论分类时使用。  
sql_create_pd_getNewsByCat;  通过分类获取文章，具有分页参数。  
sql_create_pd_AddCategory;  新增分类  
sql_create_pd_ModifyCategory;  修改分类  
sql_create_pd_GetAllCategory;  获取所有分类，由于分类信息有限，因此不设置查找分类的功能。直接返回所有的分类。  



