#!/bin/bash

## BEGIN INIT INFO
# Provides:   diaspora
# Required-Start: $local_fs $remote_fs
# Required-Stop:  $local_fs $remote_fs
# Should-Start:   $network
# Should-Stop:    $network
# Default-Start:  2 3 4 5
# Default-Stop:   0 1 6
# Short-Description:    Diaspora server components
# Description:    Starts the Diaspora server components
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DIASPORA_DIR=/home/sites/diaspora
if [[ "$DIASPORA_DIR" = /path/to/diapora/root ]]; then
echo "Please configure this script for your diapora root"
fi
USERNAME="root"
if [[ "$USERNAME" = user ]]; then
echo "Please configure this script for the correct user"
fi
cd $DIASPORA_DIR

. /lib/lsb/init-functions

export RAILS_ENV=$(./script/get_config.rb rails_env script_server)
THIN_PORT=$(./script/get_config.rb thin_port script_server)
eval "DEFAULT_THIN_ARGS=a3719c45525c3947d21db22bfbe51b28e4d877e8quot;$(./script/get_config.rb default_thin_args script_server)a3719c45525c3947d21db22bfbe51b28e4d877e8quot;"
SOCKET_PORT=$(./script/get_config.rb socket_port $RAILS_ENV)

# Backward compatibillity, overide default settings
[ -e config/server.sh ] && source config/server.sh

function chk_service
{
    OS=`uname -s`
    port=${1:?Missing port}
    case $OS in
    *[Bb][Ss][Dd]*|Darwin)
        ## checks ipv[46]
        netstat -anL | awk '{print $2}' | grep "\.$1$"
    ;;
    *)
        # Is someone listening on the ports already? (ipv4 only test ?)
        netstat -nl | grep '[^:]:'$port'[ \t]'
    ;;
    esac
}


function redis_config
# Create/update the local redis.conf file from /etc master
{
    if [ ! -w config ]; then
        # read-only installation, should be OK
        return
    fi

    if [ -r "/etc/redis.conf" ]; then
        redis_conf="/etc/redis.conf"
    elif [ -r "/etc/redis/redis.conf" ]; then
        redis_conf="/etc/redis/redis.conf"
    elif [ -r "/opt/local/etc/redis.conf" ]; then
        # MacPorts location
        redis_conf="/opt/local/etc/redis.conf"
    elif [ -r "/usr/local/etc/redis.conf" ]; then
        redis_conf="/usr/local/etc/redis.conf"
    elif [ -r "/usr/local/etc/redis/redis.conf" ]; then
        redis_conf="/usr/local/etc/redis/redis.conf"
    else
        echo "Don't know how to configure redis for this platform. Copy the configuration file redis.conf to the config directory and patch it manually. In particular, don't daemonize." >&2
        return
    fi

    if [ config/redis.conf -nt $redis_conf ]
    then
        return
    fi

    cp $redis_conf config/redis.conf
    sed -i -e '/^[^#]*daemonize/s/yes/no/'                               \
           -e '/^[^#]*logfile/s|.*|logfile /var/log/diaspora/redis.log|' \
        config/redis.conf
}

function wait_for_services_to_start {
    STARTED_SERVICES=0
    THIN_STARTED=0
    REDIS_STARTED=0
    WEBSOCKET_STARTED=0
    while [ $STARTED_SERVICES -lt 3 ]; do
        if [ $THIN_STARTED = 0 ]; then
            if status_of_proc -p tmp/thin.pid thin > /dev/null; then
                echo "Thin is running"
                THIN_STARTED=1
                let STARTED_SERVICES=STARTED_SERVICES+1
            fi
        fi

        if [ $WEBSOCKET_STARTED = 0 ]; then
            if status_of_proc -p tmp/diaspora-wsd.pid diaspora > /dev/null; then
                echo "The websocket is running"
                WEBSOCKET_STARTED=1
                let STARTED_SERVICES=STARTED_SERVICES+1
            fi
        fi

        if [ $REDIS_STARTED = 0 ]; then  
            echo `pidof redis-server` > /tmp/redis.pid
            if status_of_proc -p /tmp/redis.pid diaspora > /dev/null; then
                echo "Redis is running"
                REDIS_STARTED=1
                let STARTED_SERVICES=STARTED_SERVICES+1
            fi
        fi
    done
}

function start_services {
    # Scan for -p, find out what port thin is about to use.
    thin_values="$DEFAULT_THIN_ARGS"
    prev_arg=''
    for arg in $( echo $thin_values | awk '{ for (i = 1; i <= NF; i++) print $i}')
    do
        [ "$prev_arg" = '-p' ] && THIN_PORT="$arg"
        prev_arg="$arg"
    done


    # Is someone listening on the ports already? (ipv4 only test ?)
    services=$( chk_service $THIN_PORT )
    if [ -n "$services" ]; then
    echo "FATAL: Error: thin port $THIN_PORT is already in use. Exiting" >&2
    echo "     $services"
        exit 6
    fi

    services=$( chk_service $SOCKET_PORT )
    if [ -n "$services" ]; then
        echo "FATAL: Error: websocket port $SOCKET_PORT is already in use. Exiting" >&2
        echo "     $services"
        exit 6
    fi

    # See http://bugs.joindiaspora.com/issues/722
    services=$( chk_service 5379 )
    if [ -n "$services" ]; then
        echo "FATAL: Error:  Someone (another redis server?) is using redis port 5379" >&2
        echo "     $services"
        exit 6
    fi

    # Force AGPL
    if [ -w public -a ! -e  public/source.tar.gz ]; then
        branch=$( git branch | awk '/^[*]/ {print $2}')
        tar czf public/source.tar.gz  `git ls-tree -r $branch | awk '{print $4}'`
    fi
    if [ ! -e public/source.tar.gz ]; then
        echo "FATAL: Error: Can't find, or even create, public/source.tar.gz. Exiting" >&2
        exit 65
    fi


    # Check if database.yml exists
    if [ ! -e 'config/database.yml' ]; then
        echo 'FATAL: config/database.yml is missing! Copy over config/database.yml.example to config/database.yml and edit it properly!' >&2
        exit 68
    fi
    
    if [ ! -e 'public/assets/default.css' ]; then
        if [ "$RAILS_ENV" == 'production' ]; then
            echo "INFO: If you want further performance improvements," >&2
            echo "after the first request to the page after each git pull, run:" >&2
            echo "bundle exec jammit" >&2
        fi
    fi

    mkdir -p -v log/thin/
    cd $DIASPORA_DIR
    echo -n "Starting: "
    if [ "$(./script/get_config.rb single_process_mode $RAILS_ENV)" = "false" ]; then
        echo -n "Redis "
        redis_config
        redis-server config/redis.conf &>log/redis-console.log &
        echo -n "Resque "
        PIDFILE=tmp/pids/resque.pid QUEUE=* bundle exec rake environment resque:work &> log/resque.log &
        echo -n "Websocket "
        bundle exec ruby ./script/websocket_server.rb &> log/websocket.log &
    fi

    if [ "$(./script/get_config.rb enable_thin script_server)" = "true" ]; then
        echo "Thin"
        bundle exec thin start -d --pid tmp/thin.pid $thin_values > log/thin.log &
    fi
}

function stop_services 
{
    echo -n "Stopping Services: "
    echo -n "Thin "
    if [ -e tmp/thin.pid ]; then
        bundle exec thin --pid tmp/thin.pid stop > /dev/null
    else
        echo "Something went wrong and I can't find the Thin PID"
        echo "Trying something else"
        pkill -f "thin"
    fi
    
    echo -n "Redis "
    echo `pidof redis-server` > /tmp/redis.pid
    if [ `cat /tmp/redis.pid` != "" ]; then
    	REDIS_PID=`cat /tmp/redis.pid`
    	kill -9 $REDIS_PID
    else
        echo "Can't find the PID of Redis trying something else"
        pkill -f "redis-server config/redis.conf"
    fi

    echo "Websocket"
    if [ -e tmp/diaspora-wsd.pid ]; then
        WEBSOCKET_PID=`cat tmp/diaspora-wsd.pid`
        kill -9 $WEBSOCKET_PID
    else
        echo "Can't open websocket pid. Trying something else"
        pkill -f "websocket_server.rb"
    fi

## For some reason the above command for a resque worker doesn't produce a pid
## This is what all the places I found online said so I am lost. I am just going
## to comment it out for now.
#    RESQUE_PID=`cat log/resque.pid`
#    kill -9 $RESQUE_PID
}

function service_status {
    if status_of_proc -p log/thin.pid thin > /dev/null; then
        echo "Thin is running"
    else
        echo "Thin is not running"
    fi

    if status_of_proc -p log/diaspora-wsd.pid websocket > /dev/null; then
        echo "The websocket is running"
    else
        echo "The websocket is not running"
    fi

    echo `pidof redis-server` > /tmp/redis.pid
    if status_of_proc -p /tmp/redis.pid thin > /dev/null; then
        echo "Redis is running"
    else
        echo "Redis is not running"
    fi
}

case "$1" in
    start)
        start_services
        echo
        wait_for_services_to_start
    ;;
    stop)
        stop_services
        sleep 2
        echo
    ;;
    restart)
        stop_services
        sleep 2
        echo
        service_status
        sleep 2
        echo
        start_services
        echo
        wait_for_services_to_start
    ;;
    status)
    service_status
    ;;
    *)
        echo "Usage: diaspora {start|stop|restart|status}"
        exit 1
    ;;
esac

exit 0
