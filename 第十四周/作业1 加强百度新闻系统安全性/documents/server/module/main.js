define(function(require, exports, module){
    var currentModule;
    var processingSwitch = false;
        
    var module_news_search = {
        btn: $(""),
        container: $("#news_search_view"),
        module: require("./newslist/newslist"),
        render:false
    };
    
    var module_init_database = {
        btn: $("#init_database_btn"),
        container: $("#init_database_view"),
        module: require("./initdb/initdb"),
        render:false
    };
    
    var module_news_manage = {
        btn: $("#news_manage_btn"),
        container: $("#news_manage_view"),
        module: require("./manage_news/manage_news"),
        render:false
    };
    
    var module_category_mange = {
        btn: $("#category_manage_btn"),
        container: $("#category_manage_view"),
        module: require("./manage_category/manage_category"),
        render:false
    }
    
    var module_overview = {
        btn: $("#overview_btn"),
        container: $("#overview_view"),
        module:require("./overview/overview"),
        render:false
    }
    
    $("#main_search_input").keydown(function(e){
        //判断是否是回车键
        if (e.keyCode == 13){
            var parameter = {"action":"search","keywords":$("#main_search_input").val()}
            activeModule(module_news_search,parameter);
        }
    });
    
    // 初始化第一个模块
    module_overview.module.render(module_overview.container);
    module_overview.container.fadeIn(200, function(){
        module_overview.render = true;
        currentModule = module_overview;
    })

    // 各个模块切换的事件绑定
    module_init_database.btn.on("click",function(e){
        e.preventDefault();
        activeModule(module_init_database);
    })
    
    // 各个模块切换的事件绑定
    module_news_manage.btn.on("click",function(e){
        e.preventDefault();
        activeModule(module_news_manage);
    })
    
    // 各个模块切换的事件绑定
    module_category_mange.btn.on("click",function(e){
        e.preventDefault();
        activeModule(module_category_mange);
    })
    
   // 各个模块切换的事件绑定
    module_overview.btn.on("click",function(e){
        e.preventDefault();
        activeModule(module_overview);
    })
    
    // 管理各个模块的显示
    function activeModule(moduleName,parameter){
        // 判断当前状态是否是正在切换态，如果是，则什么都不做。
        if(processingSwitch == true){return ;}
        
        // 设置当前的状态，如果是已经在切换状态，则不执行任何事物。
        processingSwitch = true;
        currentModule.btn.removeClass("active");
        moduleName.btn.addClass("active");
        currentModule.container.fadeOut(200,function(){
            moduleName.module.render(moduleName.container,parameter);
            moduleName.render = true;
            
            moduleName.container.fadeIn(200,function(){
                currentModule = moduleName;
            });
            processingSwitch = false; 
        });
    }
});