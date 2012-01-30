# checks if the whatlanguage gem works in this system

require 'whatlanguage'

def content_language(content)
  full_language = content.language.to_s
    if full_language == "french"
      return "fr"
    elsif full_language == "spanish"
      return "es" 
    elsif full_language == "german"
      return "de"
    elsif full_language == "portuguese"
      return "pt"
    elsif full_language == "russian"
      return "ru"
    elsif full_language == "dutch"
      return "nl"
    elsif full_language == "farsi"
      return "fa"
    elsif full_language == "swedish"
      return "sv"
    elsif full_language == "english"
      return "en"
    else
      return current_user.language 
    end
end

print content_language("Je suis un good #occupy homme")

# OR...

wl = WhatLanguage.new(:all)
wl.language("Je suis un homme")  # => :french
wl.process_text("this is a test of whatlanguage's great language detection features")
# => {:german=>1, :dutch=>3, :portuguese=>3, :english=>7, :russian=>1, :farsi=>1, :spanish=>3, :french=>2}
