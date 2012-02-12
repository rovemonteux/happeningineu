#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

#   Copyright (c) 2012, Rove Monteux. This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'uri'

module StatusMessagesHelper

def dailymotion(str)
  embed = ""
  unless str.nil? or !str.include? 'dailymotion'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.dailymotion\.com[^\s]+/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'video'
        originalurl = vurl.strip
        vurl["/video/"]= "/swf/video/" 
        embed = "<object align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\"><param name=\"movie\" value=\""+vurl+"\"></param><param name=\"wmode\" value=\"transparent\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowScriptAccess\" value=\"always\"></param><embed type=\"application/x-shockwave-flash\" src=\""+vurl+"\" width=\"560\" height=\"315\" allowfullscreen=\"true\" allowscriptaccess=\"always\" wmode=\"transparent\"></embed></object>"
        begin
          str[originalurl] = embed 
        rescue Exception=>e 
          str = str + " " +  originalurl 
        end 
      end
    end
  end
  return str
end

def googlemaps(str)
  embed = ""
  unless str.nil? or !str.include? 'map'
    while vurl= str.match(/^map:.*$/ix) do
      vurl = vurl.to_s()
      unless vurl.nil?
        originalurl = vurl.strip
        embedurl = URI.escape(originalurl)
        embed = "<br/><img src=\"https://maps.googleapis.com/maps/api/staticmap?center="+embedurl+"&zoom=15&size=560x315&maptype=hybrid&sensor=false\"/><br/><br/><img src=\"https://maps.googleapis.com/maps/api/staticmap?center="+embedurl+"&zoom=17&size=560x315&maptype=hybrid&sensor=false\"/><br/><div style=\"width:560px;\"><span style=\"font-size: 9px; float: right; position: relative; margin-top: -5px; margin-bottom: -40px; \"><a href=\"http://maps.google.com/?q="+embedurl+"\" target=\"_blank\">"+vurl.strip.titleize+"</a></span></div><br/>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
        end
      end
    end
  end
  return str
end

def mp3(str)
  embed = ""
  unless str.nil? or !str.include? '.mp3'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/[^\s]+\.mp3/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? '.mp3'
        originalurl = vurl.strip
        classtag = "mp3_" + Random.rand(99999).to_s()
        embed = "<object width=\"560\" height=\"20\" wmode=\"transparent\"><param name=\"movie\" value=\"/javascripts/singlemp3player.swf?showDownload=false&file="+originalurl.html_safe+"&autoStart=false&backColor=ffffff&frontColor=cacaca&repeatPlay=false&songVolume=95\" /><param name=\"wmode\" value=\"transparent\" /><embed wmode=\"transparent\" width=\"560\" height=\"20\" src=\"/javascripts/singlemp3player.swf?showDownload=false&file="+originalurl.html_safe+"&autoStart=false&backColor=ffffff&frontColor=cacaca&repeatPlay=false&songVolume=95\" /></object><br/><span style=\"font-size: 9px; margin-top: -5px; padding-top: -5px; float: left;\">"+t('posts.show.permalink').titleize+": <a href=\""+originalurl.html_safe+"\" target=\"_blank\" rel=\"nofollow\">"+originalurl+"</a></span><br/>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
        end
      end
    end
  end
  return str
end

def genericflash(str)
  embed = ""
  unless str.nil? or !str.include? '.swf'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/[^\s]+\.swf/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? '.swf'
        originalurl = vurl.strip
        embed = "<object align=\"center\" width=\"100%\" height=\"460\" wmode=\"transparent\"><param name=\"movie\" value=\""+vurl+"\"></param><param name=\"wmode\" value=\"transparent\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowScriptAccess\" value=\"always\"></param><embed type=\"application/x-shockwave-flash\" src=\""+vurl+"\" width=\"100%\" height=\"460\" allowfullscreen=\"true\" allowscriptaccess=\"always\" wmode=\"transparent\"></embed></object><br/><span style=\"font-size: 9px; float: right; position: relative; margin-top: -5px; margin-bottom: -40px; \">"+t('posts.show.permalink').titleize+": <a href=\""+originalurl+"\" target=\"_blank\" rel=\"nofollow\">"+URI.parse(originalurl).host+"</a></span><br/>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
        end
      end
    end
  end
  return str
end

def youtube(str)
  embed = ""
  unless str.nil? or !str.include? 'youtube'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.youtube\.com[^\s]+/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'watch'
        originalurl = vurl.strip
        regex = /^.*((v\/)|(embed\/)|(watch\?))\??v?=?([^\&\?]*).*/
        vurl = vurl.match(regex)[5]
        embed = "<iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\"https://www.youtube.com/embed/"+vurl+"?wmode=opaque&fs=1&feature=oembed\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl 
          embed = ""
        end
      end
    end
  end
  return str
end

def shortyoutube(str)
  embed = ""
  unless str.nil? or !str.include? 'youtu'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/youtu\.be[^\s]+/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'youtu'
        originalurl = vurl.strip
        regex = /youtu.be.*/
        vurl = vurl.match(regex)[0]
		vurl["youtu.be/"]= "" 
        embed = "<iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\"https://www.youtube.com/embed/"+vurl+"?wmode=opaque&fs=1&feature=oembed\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl 
          embed = ""
        end
      end
    end
  end
  return str
end

def vimeo(str)
  embed = ""
  unless str.nil? or !str.include? 'vimeo'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/vimeo\.com[^\s]+/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'vimeo'
        originalurl = vurl.strip
        vurl["vimeo.com"]= "player.vimeo.com/video" 
        vurl["http:"]= "https:"
        embed = "<iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\""+vurl+"?wmode=opaque\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
          embed = ""
        end
      end
    end
  end
  return str
end

def embedcode(str)
  str = googlemaps(mp3(genericflash(dailymotion(shortyoutube(youtube(vimeo(str)))))))
  return str
end

end
