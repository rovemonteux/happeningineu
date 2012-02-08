str = "hello http://youtu.be/DUi1yf97paw hello"
videourl = str.split.grep(/(?:f|ht)tps?:\/\/youtu\.be[^\s]+/)
videourl.each do |vurl|
regex = /youtu.be.*/
vurl = vurl.match(regex)[0]
print vurl
end
