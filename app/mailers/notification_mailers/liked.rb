module NotificationMailers
  class Liked < NotificationMailers::Base
    attr_accessor :like

    def set_headers(like_id)
      @like = Like.find(like_id)
      case @like.target
      when Comment
        translation = 'notifier.liked.liked_comment'
      else
        translation = 'notifier.liked.liked'
      end

      @headers[:subject] = I18n.t(translation, :name => @sender.name)
    end
  end
end
