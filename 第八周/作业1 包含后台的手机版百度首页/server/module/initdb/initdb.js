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
            url: "../common/initdbconn.php",
            dataType: "json",
            type: "POST",
            data: {"user": user, "server": server, "port": port,  "password": pwd },
            success: function (data) {
                console.log(data);
                if (data.status == 0) {
                    $.ajax({
                        url: "../common/initdbcontent.php",
                        dataType: "text",
                        type: "GET",
                        success: function (data) {
                            $("#messageHolder").html(data);
                        }
                    });
                }
                else {
                    $("#messageHolder").html(" "+data.errorcode);
                }
            },
            error:function(data){
                console.log("出现错误!");
                $("#messageHolder").html(data.responseText);
            }
        });
    }

});