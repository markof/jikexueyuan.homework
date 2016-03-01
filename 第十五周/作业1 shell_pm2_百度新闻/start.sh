# ----------------------------------
# 维护shell，启动pm2观察的app，并启动对CPU的监控，当CPU大于98%，并持续一段时间后，重启pm2 app
# 作者： markof
# 日期： 2016.3.1
# ----------------------------------

# 进程观察的刷新频率,默认1s
observe_interval=1

# 高负载周期，即多少个observe_interval
overload_interval_threshhold=2

# cpu负荷门限值
cpu_threshhold=98

# 要监控的app的名称,需要和ecosystem.json一致
app_name="baidu_news"

# 获取CPU使用率
get_pid(){
    echo $(pm2 list|grep -i "$app_name"|cut -f 5 -d "│"|awk '{print $1}')
}

get_cpu(){
    echo $(top -l 1 -pid $1|grep -i $1|awk '{print int($3)}')
}

# 启动pm2的函数
start_pm2(){
    echo "启动pm2......"
    pm2 start ecosystem.json
}

# 停止pm2内启动的app,这里用gracefulRestart的方式
restart_pm2(){
    say -r 300 "重启PM2" || echo "重启pm2......"
    pm2 gracefulReload ecosystem.json
}

# 启动pm2进程。
start_pm2

# 初始高负载计数器
overload_interval_count=0

# 获取pid
app_pid=$(get_pid)

# 执行观察程序
while true
do    
    # 获取cpu使用率
    cpu_load=$(get_cpu $app_pid)
    
    # 判断是否能够正常获取CPU占用，如果不能则退出。
    if test $? != 0
    then
        echo "无法获取CPU占用"
        exit 0
    fi
    
    # 显示当前CPU的负载
    # say -r 300 "当前负荷：$cpu_load%"
    echo "$app_name[$app_pid]占用cpu负荷为：$cpu_load%"
    
    # 如果大于门限值则进行操作。不大于则继续。
    if test $cpu_load -ge $cpu_threshhold
    then
    
        # 超出定义的门限，执行pm2的重启动作
        overload_interval_count=$[overload_interval_count+1]
        echo "cpu负荷超出了门限值，当前cpu负荷为：$cpu_load%, 当前高负荷保持周期为：$[overload_interval_count*observe_interval]秒"
        
        if test $overload_interval_count -ge $overload_interval_threshhold
        then
            restart_pm2
        fi
    else
        overload_interval_count=0
    fi
    
    # 每秒检查一次
    sleep $observe_interval
done