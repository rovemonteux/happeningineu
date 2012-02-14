#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

#   Copyright (c) 2012, Rove Monteux. This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'uri'
require 'cgi'

module StatusMessagesHelper

def dailymotion(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? 'dailymotion'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.dailymotion\.com[^\s]+/)
	unless maxcount > 3 
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'video'
        originalurl = vurl.strip
        vurl["/video/"]= "/swf/video/" 
        embed = "<span class=\"clear\" /><object align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\"><param name=\"movie\" value=\""+vurl+"\"></param><param name=\"wmode\" value=\"transparent\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowScriptAccess\" value=\"always\"></param><embed type=\"application/x-shockwave-flash\" src=\""+vurl+"\" width=\"560\" height=\"315\" allowfullscreen=\"true\" allowscriptaccess=\"always\" wmode=\"transparent\"></embed></object><span class=\"clear\" />"
        begin
          str[originalurl] = embed 
        rescue Exception=>e 
          str = str + " " +  originalurl 
        end
	  end
      end
    end
  end
  return str
end

def googlemaps(str)
  str = "\n" +  str + "\n"
  embed = ""
  unless str.nil? or !str.include? 'map'
    vurl= str.match(/^map:.*$/ix)
      unless vurl.nil?
        vurl = vurl.to_s()
        replaceableurl = vurl.strip
        vurl[0..3] = ''
        originalurl = vurl.strip
        embedurl = URI.escape(originalurl)
        embed = "<span class=\"clear\" /><img height=\"315\" width=\"560\" src=\"https://maps.googleapis.com/maps/api/staticmap?center="+embedurl+"&zoom=13&size=784x441&maptype=hybrid&sensor=false\" class=\"map\"/><br/><br/><img height=\"315\" width=\"560\" src=\"https://maps.googleapis.com/maps/api/staticmap?center="+embedurl+"&zoom=15&size=784x441&maptype=hybrid&sensor=false\" class=\"map\"/><br/><br/><img height=\"315\" width=\"560\" src=\"https://maps.googleapis.com/maps/api/staticmap?center="+embedurl+"&zoom=17&size=784x441&maptype=hybrid&sensor=false\" class=\"map\"/><br/><div style=\"width:560px; margin-top: -5px; margin-bottom: 25px;\"><span style=\"font-size: 9px; float: right; position: relative; margin-top: -5px; margin-bottom: -40px; \"><a href=\"https://maps.google.com/?q="+embedurl+"\" target=\"_blank\" rel=\"nofollow\">"+originalurl.strip.titleize+"</a></span></div>"
        begin
          str[replaceableurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
        end
      end
    end
  return str
end

def mp3(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? '.mp3'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/[^\s]+\.mp3/)
	unless maxcount > 11 
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? '.mp3'
        originalurl = vurl.strip
        classtag = "mp3_" + Random.rand(99999).to_s()
        embed = "<span class=\"clear\" /><object width=\"560\" height=\"20\" wmode=\"transparent\"><param name=\"movie\" value=\"/javascripts/singlemp3player.swf?showDownload=false&file="+originalurl.html_safe+"&autoStart=false&backColor=ffffff&frontColor=cacaca&repeatPlay=false&songVolume=95\" /><param name=\"wmode\" value=\"transparent\" /><embed wmode=\"transparent\" width=\"560\" height=\"20\" src=\"/javascripts/singlemp3player.swf?showDownload=false&file="+originalurl.html_safe+"&autoStart=false&backColor=ffffff&frontColor=cacaca&repeatPlay=false&songVolume=95\" /></object><br/><span style=\"font-size: 9px; margin-top: -5px; padding-top: -5px; float: left;\">"+t('posts.show.permalink').titleize+": <a href=\""+originalurl.html_safe+"\" target=\"_blank\" rel=\"nofollow\">"+originalurl+"</a></span><br/>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
        end
	  end
      end
    end
  end
  return str
end

def genericflash(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? '.swf'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/[^\s]+\.swf/)
	unless maxcount > 2 
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? '.swf'
        originalurl = vurl.strip
        embed = "<span class=\"clear\" /><object align=\"center\" width=\"100%\" height=\"460\" wmode=\"transparent\"><param name=\"movie\" value=\""+vurl+"\"></param><param name=\"wmode\" value=\"transparent\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowScriptAccess\" value=\"always\"></param><embed type=\"application/x-shockwave-flash\" src=\""+vurl+"\" width=\"100%\" height=\"460\" allowfullscreen=\"true\" allowscriptaccess=\"always\" wmode=\"transparent\"></embed></object><br/><span style=\"font-size: 9px; float: right; position: relative; margin-top: -5px; margin-bottom: -40px; \">"+t('posts.show.permalink').titleize+": <a href=\""+originalurl+"\" target=\"_blank\" rel=\"nofollow\">"+URI.parse(originalurl).host+"</a></span><br/>"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
        end
	  end
      end
    end
  end
  return str
end

def youtube(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? 'youtube'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.youtube\.com[^\s]+/)
    unless maxcount > 3 
	  videourl.each do |vurl|
        unless vurl.nil? or !vurl.include? 'v='
          originalurl = vurl.strip
		  begin
		  hashes = CGI.parse(URI.parse(vurl).query)
          vurl = hashes.fetch("v")[0]
          unless vurl.nil? or vurl.empty?
            embed = "<span class=\"clear\" /><iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\"https://www.youtube.com/embed/"+vurl+"?wmode=opaque&fs=1&feature=oembed\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe><span class=\"clear\" />"
            begin
              str[originalurl] = embed
			  maxcount = maxcount + 1
            rescue Exception=>e
              str = str + " " +  originalurl 
              embed = ""
            end
		  end
		  rescue
		  vurl = originalurl
		  end
	    end
        end
	  end
    end
  return str
end

def shortyoutube(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? 'youtu'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/youtu\.be[^\s]+/)
	unless maxcount > 3 
    videourl.each do |vurl| 
      unless vurl.nil? or !vurl.include? 'youtu'
        originalurl = vurl.strip
        regex = /youtu.be.*/
        vurl = vurl.match(regex)[0]
		vurl["youtu.be/"]= "" 
        embed = "<span class=\"clear\" /><iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\"https://www.youtube.com/embed/"+vurl+"?wmode=opaque&fs=1&feature=oembed\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe><span class=\"clear\" />"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl 
          embed = ""
        end
	  end
      end
    end
  end
  return str
end

def vimeo(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? 'vimeo'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/vimeo\.com[^\s]+/)
	unless maxcount > 3 
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? 'vimeo'
        originalurl = vurl.strip
        vurl["vimeo.com"]= "player.vimeo.com/video" 
        vurl["http:"]= "https:"
        embed = "<span class=\"clear\" /><iframe align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\" src=\""+vurl+"?wmode=opaque\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe><span class=\"clear\" />"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
          embed = ""
        end
	  end
      end
    end
  end
  return str
end

def guardian(str)
  maxcount = 0
  embed = ""
  unless str.nil? or !str.include? 'www.guardian.co.uk'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/www\.guardian\.co\.uk[^\s]+/)
	unless maxcount > 2 
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? '/video/'
        originalurl = vurl.strip
        vurl["-video"] = "-video/json"
        embed = "<span class=\"clear\" /><object align=\"center\" width=\"560\" height=\"315\" wmode=\"transparent\"><param name=\"movie\" value=\"http://www.guardian.co.uk/video/embed\"></param><param name=\"wmode\" value=\"transparent\"></param><param name=\"allowFullScreen\" value=\"true\"></param><param name=\"allowScriptAccess\" value=\"always\"></param><param name=\"flashvars\" value=\"endpoint="+vurl+"\"></param><embed type=\"application/x-shockwave-flash\" src=\"http://www.guardian.co.uk/video/embed\" width=\"560\" height=\"315\" allowfullscreen=\"true\" allowscriptaccess=\"always\" wmode=\"transparent\" flashvars=\"endpoint="+vurl+"\"></embed></object><span class=\"clear\" />"
        begin
          str[originalurl] = embed
        rescue Exception=>e
          str = str + " " +  originalurl
          embed = ""
        end
	  end
      end
    end
  end
  return str
end

def embedcode(str)
  str = googlemaps(mp3(genericflash(guardian(dailymotion(shortyoutube(youtube(vimeo(str))))))))
  return str
end

end
