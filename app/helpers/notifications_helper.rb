module NotificationsHelper
  include ERB::Util
  include ActionView::Helpers::TranslationHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::TextHelper
  include PeopleHelper
  include UsersHelper
  include ApplicationHelper

  def object_link(note, actors)
    target_type = note.popup_translation_key
    actors_count = note.actors.count

    if note.instance_of?(Notifications::Mentioned)
      if post = note.linked_object
        translation(target_type, :actors => actors, :count => actors_count, :post_link => link_to(t('notifications.post'), post_path(post), :title => truncate(post.text.gsub(%r{</?[^>]+?>}, '').gsub(/[()]/, " ").gsub(/[\[\]]/, " ").gsub(/[##]/, "").gsub(/(?:f|ht)tps?:\/[^\s]+/, ''), :length => 112)).html_safe)
      else
        t(note.deleted_translation_key, :actors => actors, :count => actors_count).html_safe
      end
    elsif note.instance_of?(Notifications::CommentOnPost) || note.instance_of?(Notifications::AlsoCommented) || note.instance_of?(Notifications::Reshared) || note.instance_of?(Notifications::Liked)
      post_or_comment = note.linked_object
      if post_or_comment.nil?
        t(note.deleted_translation_key, :actors => actors, :count => actors_count).html_safe
      else
        if post_or_comment.respond_to?(:post)
          link = link_to(
            t('notifications.comment_on'),
            post_path(post_or_comment.post),
            'data-ref' => post_or_comment.id,
            :class     => 'hard_object_link',
            :title     => truncate(post_or_comment.text.gsub(%r{</?[^>]+?>}, '').gsub(/[()]/, " ").gsub(/[\[\]]/, " ").gsub(/[##]/, "").gsub(/(?:f|ht)tps?:\/[^\s]+/, ''), :length => 112) 
          ).html_safe
        else
          link = link_to(
            t('notifications.post'),
            post_path(post_or_comment),
            'data-ref' => post_or_comment.id,
            :class     => 'hard_object_link',
            :title     => truncate(post_or_comment.text.gsub(%r{</?[^>]+?>}, '').gsub(/[()]/, " ").gsub(/[\[\]]/, " ").gsub(/[##]/, "").gsub(/(?:f|ht)tps?:\/[^\s]+/, ''), :length => 112)
          ).html_safe
        end

        translation(
          target_type,
          :actors => actors,
          :count => actors_count,
          :post_author => h(post_or_comment.author.name),
          :post_link => link
        )
      end
    else #Notifications:StartedSharing, etc.
      translation(target_type, :actors => actors, :count => actors_count)
    end
  end

  def translation(target_type, opts = {})
    {:post_author => nil}.merge!(opts)
    t("#{target_type}", opts).html_safe
  end


  def new_notification_link(count)
    if count > 0
        link_to new_notification_text(count), notifications_path
    end
  end

  def notification_people_link(note, people=nil)
    actors =people || note.actors
    number_of_actors = actors.count
    sentence_translations = {:two_words_connector => " #{t('notifications.index.and')} ", :last_word_connector => ", #{t('notifications.index.and')} " }
    actor_links = actors.collect{ |person|
      person_link(person, :class => 'hovercardable')
    }

    if number_of_actors < 4
      message = actor_links.to_sentence(sentence_translations)
    else
      first, second, third, *others = actor_links
      others_sentence = others.to_sentence(sentence_translations)
      if others.count == 1
        others_sentence = " #{t('notifications.index.and')} " + others_sentence
      end
      message = "#{first}, #{second}, #{third},"
      message += "<a class='more' href='#'> #{t('notifications.index.and_others', :count =>(number_of_actors - 3))}</a>"
      message += "<span class='hidden'> #{others_sentence} </span>"
    end
    message.html_safe
  end

  def notification_message_for(note)
    object_link(note, notification_people_link(note))
  end

  def peoples_names(note)
    note.actors.map{|p| p.name}.join(", ")
  end

  def the_day(i18n)
    i18n[0].match(/\d/) ? i18n[0].gsub('.', '') : i18n[1].gsub('.', '')
  end

  def the_month(i18n)
    i18n[0].match(/\d/) ? i18n[1] : i18n[0]
  end
end
