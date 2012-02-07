str = "hello ! this is a video https://www.dailymotion.com/video/xl7gmz_snoop-dogg-game-purp-yellow-la-leakers-skeetox-remix-music-video-official-lakers-wiz-khalifa_music and more text"
embed = "";
unless str.nil? or !str.include? 'dailymotion'
videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.dailymotion\.com[^\s]+/)[0]
print videourl;
unless videourl.nil? or !videourl.include? 'video'
videourl["/video/"]= "/swf/video/"
embed = "<object width=\"640\" height=\"360\"><param name=\"movie\" value=\""+videourl+"\"></param><param name=\"allowFullScreen\" value=\"true\"></par    am><param name=\"allowScriptAccess\" value=\"always\"></param><embed type=\"application/x-shockwave-flash\" src=\""+videourl+"\" width=\"640\" height=\"360\"     allowfullscreen=\"true\" allowscriptaccess=\"always\"></embed></object>"
end
end
print embed;
