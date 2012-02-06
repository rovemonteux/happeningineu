str = "hello hello <p><a href=\"http://www.youtube.com/watch?v=St7Ezip0Eyc\" target=\"_blank\">http://www.youtube.com/watch?v=St7Ezip0Eyc</a></p> http://www.youtube.com/watch?v=St7Ezip0Eyc hello http://www.ireland.com/ hello"

print str.gsub!(/(?:f|ht)tps?:\/\/www\.youtube\.com[^\s]+/, '')
