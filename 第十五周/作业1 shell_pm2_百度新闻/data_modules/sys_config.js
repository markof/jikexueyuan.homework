/**
 * @author:markof
 * @update:2016.1.10
 * @description:
 * 系统配置文件，作为node module出现。
 */

'use strict';

/**
 * db_config_file_name
 * 数据库配置保存的文件,可以使用绝对路径和相对路径。
 * 系统启动时，如果是该文件不存在，会有个提示，该提示不影响系统的运行。
 * 该文件有两种创建方式
 * 1. 手动创建
 * 格式为:{"usr":"user","pwd":"123123","server":"127.0.0.1","db_name":"my_db"}。注意对象的value一定要使用引号包围。
 * 2. 系统创建
 * 可以通过前端的数据库初始化工具进行创建。该工具会尝试用用户输入的参数对数据库进行连接，连接成功并初始化数据库成功后，创建该配置文件。
 * 该文件保存了数据库的连接参数，如果参数有变化，可以手动修改，但需要重新启动。
 */
const db_config_file_name = './db.config'

/**
 * db_database_name
 * 数据库的名称定义。
 * 利用前端的数据库初始化工具对数据库进行初始化时会使用到参数。
 * 如果是
 * 1. 在数据库初始化前，修改该参数，该参数会影响
 *      1）前端数据库初始化工具，初始化的数据库名称。
 *      2）系统自动保存的数据库的配置文件【文件定义请参考系统配置文件中的 db_config_file_name 定义】的数据库名称参数。
 * 2. 在数据库已经初始化后，修改该参数
 *      1）无任何影响。如果希望在数据库已经初始化后，修改要连接的数据库名称，请修改【系统配置文件中的 db_config_file_name 定义的文件】该文件中的内容。
 */
const db_database_name = 'my_db';

/**
 * page_size
 * 用于控制分页的主要参数，决定了法向客户端的最大数据条目。
 * 同时用于在数据库查找时，用于限定数据库返回的数据条目。
 */
const page_size = 5;

/**
 * server_port
 * 服务器的监听端口，这里默认设置为9000端口。
 * 请注意，如果使用通用端口，如80端口，需要注意权限。在linux/OS X系统下使用sudo启动，windows下使用使用管理员权限启动。
 */
const server_port = 9000;

//可以作为模块进行导入
module.exports={
    'config_file':db_config_file_name,
    'db_name':db_database_name,
    'page_size':page_size,
    'server_port':server_port
};