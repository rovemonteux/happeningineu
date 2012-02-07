#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

#   Copyright (c) 2012, Rove Monteux. This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module StatusMessagesHelper

def embedcode(str)
  embed = "";
  unless str.nil? or !str.include? 'dailymotion'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.dailymotion\.com[^\s]+/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'video'
        originalurl = vurl.strip
        vurl["/video/"]= "/swf/video/" 
        embed = "<object align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\"><param name=\"movie\" value=\""+vurl+"\"></param><param name=\"wmode\" value=\"transparent\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowScriptAccess\" value=\"always\"></param><embed type=\"application/x-shockwave-flash\" src=\""+vurl+"\" width=\"560\" height=\"315\" allowfullscreen=\"true\" allowscriptaccess=\"always\"></embed></object>"
        begin
          str[originalurl] = embed 
        rescue Exception=>e 
          str = str + ":" +  originalurl + ":" 
        end 
      end
    end
  end
  unless str.nil? or !str.include? 'youtube'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.youtube\.com[^\s]+/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'watch'
        originalurl = vurl.strip
        regex = /youtube.com.*(?:\/|v=)(\w+)/
        vurl = vurl.match(regex)[1]
        embed = "<iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\"https://www.youtube.com/embed/"+vurl+"?wmode=opaque&fs=1&feature=oembed\" frameborder=\"0\" allowfullscreen></iframe>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + ":" +  originalurl + ":" 
          embed = ""
        end
      end
    end
  end
  return str;
end

end
