require 'erb'

module Diaspora
  module Markdownify
    class HTML < Redcarpet::Render::HTML
      include ActionView::Helpers::TextHelper
      include ActionView::Helpers::TagHelper

      def autolink(link, type)
        if !link.include? '.mp3'
          auto_link(link, :link => :urls, :html => { :target => "_blank" })
        else
           return link
        end
      end

    end
  end
end
