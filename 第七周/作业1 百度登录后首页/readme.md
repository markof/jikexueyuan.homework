#极客学院作业-第六周-作业1-完成登录后的百度首页
##HTML部分
###HTML5的地理信息获取
为了能够正确的获取天气，这里需要通过浏览器获取用户的地理信息。如果不能获取则使用默认的“北京”。
目前在PC端获取地理信息有两种方法：  
1.通过IP在服务器端判断IP所在的地理信息。  
2.通过浏览器提供的HTML5的地理信息API。 
   
实际上一般是通过服务器在服务器端判断用户的IP来判断用户所在的区域位置，然后返回所需要的天气，但是由于是纯前端的学习，因此就无法采用服务器判断IP的方式。
另外一种是通过IP来获取地理位置信息，但是目前javascript并不能直接获取本地的IP地址，又需要使用联网的API，这样获取天气的操作就需要使用到三个网络API，他们分别是:  
-通过网络API获取本地的IP地址。  
-通过本地IP地址获取本机的地理信息。  
-通过本机的地理信息查询对应的天气。  
  
如果按照上述操作来做，未必有点过于繁琐，且性能较差。因此这里指采用第一种方法，即HTML5中提供的地理位置获取方法来做。但这种方法也有个弊端，就是需要用户的同意，但通常情况下用户同意的概率较低，另外一个问题是在PC端使用该API精度不高。通常也是采用通过IP信息获取地理信息。  

*突然发现PC上使用HTML5的地理API根本毫无隐私安全啊。

##CSS部分

##JS部分
通常的没有什么特别的要说明的，只是有一个比较坑爹的效果实现，是需要用到mouseWheel事件，而这个见鬼的东西目前在IE和webkit，firefox之间的兼容性不好，具体可以参考下面这个链接：
http://www.zhangxinxu.com/wordpress/2013/04/js-mousewheel-dommousescroll-event/  
目前实现暂时不参考兼容性。

##Ajax部分
###天气部分
在百度首页登陆后的个性化首页上方有个顶端工具条。在顶端工具条的左上角，有个显示天气的地方。
1. 图标  
图标采用阿里的iconfont，这里采用了简单的几个图标用于示例。

2. 地理信息获取  
请参见 [HTML5的地理信息获取]

3. 天气API  
天气API采用的是百度的天气API，做个简单的应用还是够的。下面是具体的接口和官方对于输入参数的说明。
>http://api.map.baidu.com/telematics/v3/weather?location=%E6%88%90%E9%83%BD&output=json&ak=CE581850502e6c81cb11cfd131d6b83c  

|参数类型|参数名称|是否必须|具体描述|
|---|:---:|:---:|---|
|String|ak|true|开发者密钥|
|String|sn|false|若用户所用ak的校验方式为sn校验时该参数必须。 （sn生成算法）|
|String|location|true|"分隔,location=116.305145,39.982368&brvbar;122.305145,36.982368&brvbar;….|
|String|output|false|输出的数据格式，默认为xml格式，当output设置为’json’时，输出的为json格式的数据;|
|String|coord_type|false|请求参数坐标类型，默认为gcj02经纬度坐标。允许的值为bd09ll、bd09mc、gcj02、wgs84。bd09ll表示百度经纬度坐标，bd09mc表示百度墨卡托坐标，gcj02表示经过国测局加密的坐标。wgs84表示gps获取的坐标。|
|String|callback|false|将json格式的返回值通过callback函数返回以实现jsonp功能。举例：callback=showLocation(JavaScript函数名)。|

##模块化
目标是百度首页，百度首页细分下来是由很多可以分割的部分组成。其中Theme的更换，天气的现实，侧边的导航条等，都可以独立进行CSS和JS代码的开发。
这里前端的模块化尝试采用Seajs来进行部署。  
[疑问]：本次课程的模块化开发，我理解应该是前端工程化的一部分。讲解的Seajs符合CommonJS的模块定义规范。我查了Seajs的文档发现可以进行CSS和JS的模块化，如果希望HTML代码也模块化，是不是就要使用例如FIS这样的流程化工具？  
这里将主页分成如下几个模块进行开发：
1. page_top_bar (首页上方的顶端工具条，包含CSS代码和JS代码，依赖于下面的天气)
2. tool_weather (用于显示天气) 
4. tool_theme (用于更换主题)
6. tool_nav_more （用于显示侧边的更多产品导航）
3. page_search_bar (中间的搜索框部分)
4. page_usr_private （下方的”我的关注“）
5. page_usr_video （下方的”视频“）
6. page_usr_suggest （下方的”推荐“）
7. page_usr_nav （下方的导航）
8. page_usr_shopping （下方的购物）