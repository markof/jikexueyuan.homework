#前端面试题
##一、HTML相关问题
###对WEB标准以及W3C的理解与认识
>标签闭合、标签小写、不乱嵌套、提高搜索机器人搜索几率、使用外 链css和js脚本、结构行为表现的分离、文件下载与页面速度更快、内容能被更多的用户所访问、内容能被更广泛的设备所访问、更少的代码和组件，容易维 护、改版方便，不需要变动页面内容、提供打印版本而不需要复制内容、提高网站易用性；

###Doctype作用? 严格模式与混杂模式-如何触发这两种模式，区分它们有何意义?
>（1）、!DOCTYPE 声明位于文档中的最前面，处于 &lt;html> 标签之前。告知浏览器的解析器，用什么文档类型 规范来解析这个文档。   
>（2）、严格模式的排版和 JS 运作模式是  以该浏览器支持的最高标准运行。   
>（3）、在混杂模式中，页面以宽松的向后兼容的方式显示。模拟老式浏览器的行为以防止站点无法工作。   
>（4）、DOCTYPE不存在或格式不正确会导致文档以混杂模式呈现。 

###浏览器标准模式和怪异模式之间的区别是什么？
>由于历史的原因，各个浏览器在对页面的渲染上存在差异，甚至同一浏览器在不同版本中，对页面的渲染也不同。在W3C标准出台以前，浏览器在对页面的渲染上没有统一规范，产生了差异(Quirks mode或者称为Compatibility Mode)；由于W3C标准的推出，浏览器渲染页面有了统一的标准(CSScompat或称为Strict mode也有叫做Standars mode，这就是二者最简单的区别。
>W3C标准推出以后，浏览器都开始采纳新标准，但存在一个问题就是如何保证旧的网页还能继续浏览，在标准出来以前，很多页面都是根据旧的渲染方法编写的，如果用的标准来渲染，将导致页面显示异常。为保持浏览器渲染的兼容性，使以前的页面能够正常浏览，浏览器都保留了旧的渲染方法（如：微软的IE）。这样浏览器渲染上就产生了Quircks mode和Standars mode，两种渲染方法共存在一个浏览器上。

>###火狐一直工作在标准模式下，但IE（6，7，8）标准模式与怪异模式差别很大，主要体现在对盒子模型的解释上，这个很重要，下面就重点说这个。那么浏览器究竟该采用哪种模式渲染呢？这就引出的DTD，既是网页的头部声明，浏览器会通过识别DTD而采用相对应的渲染模式：
>1. 浏览器要使老旧的网页正常工作，但这部分网页是没有doctype声明的，所以浏览器对没有doctype声明的网页采用quirks mode解析。  
>2. 对于拥有doctype声明的网页，什么浏览器采用何种模式解析，这里有一张详细列表可参考：http://hsivonen.iki.fi/doctype。  
>3. 对于拥有doctype声明的网页，这里有几条简单的规则可用于判断：对于那些浏览器不能识别的doctype声明，浏览器采用strict mode解析。  
>4. 在doctype声明中，没有使用DTD声明或者使用HTML4以下（不包括HTML4）的DTD声明时，基本所有的浏览器都是使用quirks mode呈现，其他的则使用strict mode解析。  
>5. 可以这么说，在现有有doctype声明的网页，绝大多数是采用strict mode进行解析的。  
>6. 在ie6中，如果在doctype声明前有一个xml声明(比如:<?xml version=”1.0″ encoding=”iso-8859-1″?>)，则采用quirks mode解析。这条规则在ie7中已经移除了。  
>
>###如何设置为怪异模式：
>方法一：在页面项部加 <!DOCTYPE HTML PUBLIC “-//W3C//DTD HTML 4.01 Transitional//EN”>  
>方法二：什么也不加。
>
>###如何设置为标准模式：
>加入以下任意一种：HTML4提供了三种DOCTYPE可选择：
><!DOCTYPE HTML PUBLIC “-//W3C//DTD HTML 4.01 Transitional//EN” “http://www.w3.org/TR/html4/loose.dtd”>  
><!DOCTYPE HTML PUBLIC “-//W3C//DTD HTML 4.01//EN” “http://www.w3.org/TR/html4/strict.dtd”>  
><!DOCTYPE HTML PUBLIC “-//W3C//DTD HTML 4.01 Frameset//EN” “http://www.w3.org/TR/html4/frameset.dtd”>  
>
>###XHTML1.0提供了三种DOCTYPE可选择：  
>(1)过渡型（Transitional ）  
><!DOCTYPE html PUBLIC “-//W3C//DTD XHTML 1.0 Transitional//EN” “http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd”>  
>(2)严格型（Strict ）  
><!DOCTYPE html PUBLIC “-//W3C//DTD XHTML 1.0 Strict//EN” “http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd”>  
>(3)框架型（Frameset ）  
><!DOCTYPE html PUBLIC “-//W3C//DTD XHTML 1.0 Frameset//EN” “http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd”>  
>
>###如何判定现在是标准模式还是怪异模式：
>方法一：执行以下代码
>alert(window.top.document.compatMode) ;  
>//BackCompat  表示怪异模式  
>//CSS1Compat  表示标准模式  
>
>方法二：jquery为我们提供的方法，如下：  
>alert($.boxModel)  
>alert($.support.boxModel)

###语义化的理解？
>html语义化就是让页面的内容结构化，便于对浏览器、搜索引擎解析；  
>在没有样式CCS情况下也以一种文档格式显示，并且是容易阅读的。  
>搜索引擎的爬虫依赖于标记来确定上下文和各个关键字的权重，利于 SEO。  
>使阅读源代码的人对网站更容易将网站分块，便于阅读维护理解。

###你如何对网站的文件和资源进行优化?期待的解决方案包括：
>文件合并  
>文件最小化/文件压缩  
>使用CDN托管  
>缓存的使用
  

###前端页面有哪三层构成，分别是什么?作用是什么?
>结构层 Html 表示层 CSS 行为层 js

###你做的页面在哪些流览器测试过?这些浏览器的内核分别是什么?
Ie(Ie内核) 火狐（Gecko） 谷歌（webkit） opear(Presto)

###行内元素有哪些？块级元素有哪些？ 空(void)元素有那些？
>（1）CSS规范规定，每个元素都有display属性，确定该元素的类型，每个元素都有默认的display值，比如div默认display属性值为“block”，成为“块级”元素；span默认display属性值为“inline”，是“行内”元素。  
>（2）行内元素有：a b span img input select strong（强调的语气）  
>（3）块级元素有：div ul ol li dl dt dd h1 h2 h3 h4…p   
>（4）知名的空元素： br hr img input link meta  
>鲜为人知的是： area base col command embed keygen param source track wbr

###标签上title与alt属性的区别是什么?
>Alt 当图片不显示是 用文字代表。
>Title 为该属性提供信息

###xhtml和html有什么区别
>HTML是一种基本的WEB网页设计语言，XHTML是一个基于XML的置标语言
>XHTML 元素必须被正确地嵌套。  
>XHTML 元素必须被关闭。  
>XHTML标签名必须用小写字母。  
>XHTML 文档必须拥有根元素。 

###使用XHTML的局限有那些？
###如果页面使用'application/xhtml+xml'会有什么问题吗？
###如果网页内容需要支持多语言，你会怎么做？
###在设计和开发多语言网站时，有哪些问题你必须要考虑？
###在HTML5的页面中可以使用XHTML的语法吗？
###在HTML5中如何使用XML？
###'data-'属性的作用是什么？
###如果把HTML5看作做一个开放平台，那它的构建模块有那些？
###请描述一下cookies，sessionStorage和localStorage的区别？


##二、CSS相关问题
###.link 和@import 的区别是?
>（1）、link属于XHTML标签，而@import是CSS提供的;  
>（2）、页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;  
>（3）、import只在IE5以上才能识别，而link是XHTML标签，无兼容问题;  
>（4）、link方式的样式的权重 高于@import的权重.

###CSS 选择符有哪些？哪些属性可以继承？
>1.id选择器（ # myid）  
>2.类选择器（.myclassname）  
>3.标签选择器（div, h1, p）  
>4.相邻选择器（h1 + p）  
>5.子选择器（ul < li）  
>6.后代选择器（li a）  
>7.通配符选择器（ * ）  
>8.属性选择器（a\[rel = "external"]）  
>9.伪类选择器（a: hover, li: nth - child）  
>可继承： font-size font-family color, UL LI DL DD DT;  
>不可继承 ：border padding margin width height;  
>优先级就近原则，样式定义最近者为准;  
>载入样式以最后载入的定位为准;  

###CSS优先级算法如何计算？ CSS3新增伪类有那些？
>!important >  id > class > tag  
>important 比 内联优先级高
>
>p:first-of-type 选择属于其父元素的首个 p 元素的每个 p 元素。  
>p:last-of-type  选择属于其父元素的最后 p 元素的每个 p 元素。  
>p:only-of-type  选择属于其父元素唯一的 p 元素的每个 p 元素。  
>p:only-child    选择属于其父元素的唯一子元素的每个 p 元素。  
>p:nth-child(2)  选择属于其父元素的第二个子元素的每个 p 元素。  
>:enabled、:disabled 控制表单控件的禁用状态。  
>:checked，单选框或复选框被选中。  

###描述css reset的作用和用途。
>因为浏览器的品种很多，每个浏览器的默认样式也是不同的，比如&lt;button>标签，在IE浏览器、Firefox浏览器以及Safari浏览器中的样式都是不同的，所以，通过重置button标签的CSS属性，然后再将它统一定义，就可以产生相同的显示效果。

###描述下浮动和它的工作原理。

###清除浮动的几种方式，各自的优缺点
>1.使用空标签清除浮动 clear:both（理论上能清楚任何标签，，，增加无意义的标签）  
>2.使用overflow:auto（空标签元素清除浮动而不得不增加无意代码的弊端,使用zoom:1用于兼容IE）  
>3.是用afert伪元素清除浮动(用于非IE浏览器)

###解释css sprites，如何使用。
>Css 精灵 把一堆小的图片整合到一张大的图片上，减轻服务器对图片的请求数量

###写出几种IE6 BUG的解决方法
>1.双边距BUG float引起的 使用display  
>2.3像素问题 使用float引起的 使用dislpay:inline -3px  
>3.超链接hover 点击后失效 使用正确的书写顺序 link visited hover active
>4.Ie z-index问题 给父级添加position:relative
>5.Png 透明 使用js代码 改
>6.Min-height 最小高度 ！Important 解决’
>7.select 在ie6下遮盖 使用iframe嵌套
>8.为什么没有办法定义1px左右的宽度容器（IE6默认的行高造成的，使用over:hidden,zoom:0.08 line-height:1px）

###你最喜欢的图片替换方法是什么，你如何选择使用。
###讨论CSS hacks，条件引用或者其他。
###如何为有功能限制的浏览器提供网页。
###你会使用那些技术和处理方法。
###如何视觉隐藏网页内容，只让它们在屏幕阅读器中可用。
###你使用过网格系统吗？如果使用过，你最喜欢哪种？
###你使用过meidia queries（媒体查询）吗，或者移动网站相关的CSS布局。
###你熟悉SVG样式的书写吗？
###如何优化网页的打印样式。
###在书写高效CSS文件时会有哪些问题需要考虑。
###你使用CSS预处理器吗？(SASS,Compass,Stylus,LESS)
###如果使用，描述你的喜好。
###你是否接触过使用非标准字体的设计？
###字体服务，Google Webfonts, Typekit,等等。
###请解释浏览器是如何根据CSS选择器选择对应元素的。




 








