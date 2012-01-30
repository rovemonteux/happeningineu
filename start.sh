#/bin/bash
export RUBY_HEAP_MIN_SLOTS=2000
export RUBY_HEAP_SLOTS_INCREMENT=2000
export RUBY_HEAP_SLOTS_GROWTH_FACTOR=1
export RUBY_GC_MALLOC_LIMIT=600000
export RUBY_HEAP_FREE_MIN=65536
cd /home/sites/diaspora
/etc/init.d/diaspora stop
killall -9 ruby1.9.1
killall -9 ruby
/etc/init.d/redis-server stop
./script/server &
/etc/init.d/redis-server start &
