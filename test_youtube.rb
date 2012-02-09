def genericflash(str)
  embed = "";
  unless str.nil? or !str.include? '.swf'
    videourl = str.split.grep(/(?:f|ht)tps?:\/\/[^\s]+\.swf/)
    videourl.each do |vurl|
      unless vurl.nil? or !vurl.include? '.swf'
        originalurl = vurl.strip
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

print genericflash("hello http://images.4channel.org/f/src/589217_scale_of_universe_enhanced.swf hello")
