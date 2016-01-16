/**
 * @author:markof
 * @update:2016.1.16
 * @description:
 * 项目FIS工程流程定义。
 */

/*****************************************
 * 项目基本定义部分
 ****************************************/
fis.set('project.files', ['*.html', 'map.json']);
fis.set('project.version', '1.0.0');
fis.set('project.ignore', ['node_modules/**', 'output/**', '.git/**', 'fis-conf.js', 'package.json', 'readme.md']);

/*****************************************
 * 目录输出及定义部分
 ****************************************/
// 输出到静态文件下,并设置版本号
fis.match('*.js', {
    useHash: true,
    release: './' + fis.get('project.version') + '/js/$0'
});

// 输出到静态文件下,并设置版本号
fis.match('*.css', {
    useHash: true,
    release: './' + fis.get('project.version') + '/css/$0'
});

// 将图像输出到图像文件夹
fis.match('::image', {
    useHash: true,
    release: './' + fis.get('project.version') + '/images/$0'
});

// 输出所有页面文件
fis.match('*.html', {
    release: './' + fis.get('project.version') + '/htmls/$0',
    optimizer: fis.plugin('html-minifier')
});

// 输出首页到根目录
fis.match('index.html', {
    release: './' + fis.get('project.version') + '/$0'
});

// 这只是一个模拟ajax获取数据的文件，这里暂时这么处理，实际项目中不会存在该文件
fis.match('moreVideodata.html', {
    release: './' + fis.get('project.version') + '/$0',
});

/*****************************************
 * seajs适配部分
 ****************************************/
// 导入基本的seajs模块配置。
fis.hook('cmd', {
    forwardDeclaration: true,
    baseUrl: "./",
    paths: {
        'reset-css': 'module/reset/reset.css',
        'jquery': 'module/jquery/jquery.js',
        'theme': 'index/tool_theme/tool_theme.js',
        'searchbar': 'index/page_search_bar/page_search_bar.js',
        'maincard': 'index/page_main_card/page_main_card.js',
        'cardmy': 'index/card_my/card_my.js',
        'footer': 'index/page_footer/page_footer.js'
    }
});

// 使用CMD规范解析所有JS文件。
fis.match('module/*.js', {
    isMod: true
});

// 使用CMD规范解析所有seajs依赖的模块文件。
fis.match('index/**.{html,css,js}', {
    isMod: true
});

// 定义CMD规范，排除seajs本身
fis.match('/seajs/*.js', {
    isMod: false
});

// 对依赖资源进行打包处理，生成map文件。
fis.match('::packager', {
    postpackager: fis.plugin('loader')
});

// 在打包阶段处理所有的seajs的依赖，将其依赖修改为正确的链接。
fis.match('::packager', {
    prepackager: function (ret, conf, settings, opt) {
        // 获取所有文件
        var files = fis.util.toArray(ret.src); 
        
        // 循环遍历每个文件
        for (var fileIndex = 0; fileIndex < files.length; fileIndex++){
            // 处理JS代码中的依赖,其他文件不理会
            if (files[fileIndex].isJsLike) {
                // 获取文件的内容
                var content = files[fileIndex].getContent();
                // 匹配依赖相关信息
                var reg = /\[[^\]]*\]/;
                var requires = content.match(reg);                
                // 匹配不到就直接跳出当前循环
                if (!requires) continue;
                else {
                    // 去掉无关字符，包括引号和中括号
                    var reqItems = requires[0].replace(/["|'|\[|\]]/g, '').split(','); 
                    //处理每个匹配出来的依赖的项    
                    for (var reqIndex = 0; reqIndex < reqItems.length; reqIndex++) {
                        // 根据依赖项在cache中查找该文件。
                        var requireFile = ret.src['/'+ reqItems[reqIndex].trim()];
                        // 如果该文件存在，就将当前正在处理的js文件中的依赖替换为项目的最终部署路径。
                        if (!requireFile) continue; 
                        // 如果该文件是CSS文件，或者HTML文件
                        if (requireFile.isCssLike || requireFile.isHtmlLike) {
                            // 替换掉当前文件中的该文件链接
                            content = content.replace(new RegExp(reqItems[reqIndex].trim(), 'g'), requireFile.getUrl());
                        }
                    }
                    // 保存替换后的内容回文件。
                    files[fileIndex].setContent(content);   
                } //if（!requires) end
            } //if(files[fileIndex].isJsLike)end
        }//for end
    }//function end
});

/*****************************************
 * 文件压缩，优化部分
 ****************************************/
// 对js文件进行压缩
fis.match('*.js', {
    optimizer: fis.plugin('uglify-js'),
    mangle: {
        except: 'exports, module, require, define'
    }
});

// 对html内嵌的html进行压缩
fis.match('*.html:js', {
    optimizer: fis.plugin('uglify-js'),
    mangle: {
        except: 'exports, module, require, define'
    }
});

// 对CSS文件进行压缩
fis.match('*.css', {
    optimizer: fis.plugin('clean-css')
});

