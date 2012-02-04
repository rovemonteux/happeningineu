#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

# These helper methods can be called in your template to set variables to be used in the layout
# This module should be included in all views globally,
# to do so you may need to add this line to your ApplicationController
#   helper :layout

require 'whatlanguage'
require 'htmlentities'

module LayoutHelper
  def title(page_title, show_title = true)
    content_for(:title) { page_title.to_s }
    @show_title = show_title
  end

  def page_title(text=nil)
    return text unless text.blank?
    current_user ? current_user.name : AppConfig[:pod_name]
  end

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
        begin
          return current_user.language
        rescue
          return "en"
        end
      end
  end

  def clean_content(content)
    coder = HTMLEntities.new
    return coder.decode(content)
  end

  def show_title?
    @show_title
  end

  def stylesheet(*args)
    content_for(:head) { stylesheet_link_tag(*args) }
  end

  def javascript(*args)
    content_for(:head) { javascript_include_tag(*args) }
  end

  def new_notification_text(count)
      t('notifications.helper.new_notifications', :count => count)
  end

  def new_message_text(count)
    t('conversations.helper.new_messages', :count => count)
  end
end
