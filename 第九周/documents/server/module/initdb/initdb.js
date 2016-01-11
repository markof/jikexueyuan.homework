define(function (require, exports, module) {

    module.exports = {
        render: function (container) {
            var html = require("./initdb.html");
            container.html(html);
            
            // 事件绑定，尝试获取数据
            $("#initdbbtn").on("click",tryInitDatabase);
        }
    };

    function tryInitDatabase() {
        var server = $("#initdbserver").val();
        var port = $("#initdbport").val();
        var user = $("#initdbuser").val();
        var pwd = $("#initdbpwd").val();

        $.ajax({
            url: "/db/init",
            dataType: "json",
            type: "POST",
            data: {"user": user, "server": server, "port": port,  "password": pwd },
            success: function (data) {
                if (data.status == 0) {
                    $("#messageHolder").html("数据库初始化成功！");
                }
                else {
                    $("#messageHolder").html(" "+data.errorcode);
                }
            },
            error:function(data){
                $("#messageHolder").html(data.responseText);
            }
        });
    }

});