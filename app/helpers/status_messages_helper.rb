#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

module StatusMessagesHelper

def cleantext(str)
  unless str.nil? or !str.include? 'youtube'
    str = str.gsub!(/(?:f|ht)tps?:\/\/www\.youtube\.com[^\s]+/, '')
  end
  return str;
end

end
