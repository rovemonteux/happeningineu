#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.
#

class ShareVisibilitiesController < ApplicationController
  before_filter :authenticate_user!

  def update
    #note :id references a postvisibility
    shareable_id = ( params[:shareable_id] || params[:post_id] ).to_i
    shareable_type = params[:shareable_type] || 'Post'

    @post = accessible_post
    @contact = current_user.contact_for(@post.author)
    if @contact.nil?
      @contact = current_user.contacts.create!(
        :person_id => @post.author.id,
        :sharing => false,
        :receiving => false
      )
    end

    @vis = ShareVisibility.where(
      :contact_id => @contact.id,
      :shareable_id => shareable_id,
      :shareable_type => shareable_type
    ).first

    if @vis
      @vis.hidden = !@vis.hidden
      if @vis.save
        update_cache(@vis)
        render 'update'
        return
      end
    else
      @vis = ShareVisibility.create!(
        :shareable_id => shareable_id,
        :shareable_type => shareable_type,
        :contact_id => @contact.id,
        :hidden => true
      )
      update_cache @vis
      render 'update'
      return
    end

    render :nothing => true, :status => 403
  end

  protected

  def update_cache(visibility)
    return unless RedisCache.configured?

    cache = RedisCache.new(current_user, 'created_at')

    if visibility.hidden?
      cache.remove(accessible_post.id)
    else
      cache.add(accessible_post.created_at.to_i, accessible_post.id)
    end
  end

  def accessible_post
    @post ||= Post.where(:id => params[:post_id]).select("id, guid, author_id, created_at").first
  end
end
