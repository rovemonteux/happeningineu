#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

describe ShareVisibilitiesController do
  before do
    @status = alice.post(:status_message, :text => "hello", :to => alice.aspects.first)
    @vis = @status.share_visibilities.first
    sign_in :user, bob
  end

  describe '#update' do
    before do
      @controller.stub(:update_cache)
    end

    context "on a post you can see" do
      it 'succeeds' do
        put :update, :format => :js, :id => 42, :post_id => @status.id
        response.should be_success
      end

      it 'calls #update_cache' do
        @controller.should_receive(:update_cache).with(an_instance_of(ShareVisibility))
        put :update, :format => :js, :id => 42, :post_id => @status.id
      end

      it 'marks hidden if visible' do
        @vis.hidden.should be_false
        put :update, :format => :js, :id => 42, :post_id => @status.id
        @vis.reload.hidden.should be_true
      end

      it 'marks visible if hidden' do
        @vis.hidden.should be_false
        @vis.update_attributes(:hidden => true)
        @vis.hidden.should be_true

        put :update, :format => :js, :id => 42, :post_id => @status.id
        @vis.reload.hidden.should be_false
      end

      context 'authored by a non-contact' do
        before do
          @message = eve.post(:status_message, :text => 'howdy', :to => eve.aspects.first, :public => true)
          bob.contacts.should_not include(eve)
        end

        it 'marks hidden if visible' do
          @message.share_visibilities.where(:hidden => true).should be_empty
          put :update, :format => :js, :id => 42, :post_id => @message.id
          @message.share_visibilities.where(:hidden => true).should_not be_empty
        end
      end
    end

    context "post you do not see" do
      before do
        sign_in :user, eve
      end

      it 'does not let a user destroy a visibility that is not theirs' do
        lambda {
          put :update, :format => :js, :id => 42, :post_id => @status.id
        }.should_not change(@vis.reload, :hidden).to(true)
      end
    end
  end

  describe '#update_cache' do
    before do
      @controller.params[:post_id] = @status.id
      @cache = RedisCache.new(bob, 'created_at')
      RedisCache.stub(:new).and_return(@cache)
      RedisCache.stub(:configured?).and_return(true)
    end

    it 'does nothing if cache is not configured' do
      RedisCache.stub(:configured?).and_return(false)
      RedisCache.should_not_receive(:new)
      @controller.send(:update_cache, @vis)
    end

    it 'removes the post from the cache if visibility is marked as hidden' do
      @vis.hidden = true
      @cache.should_receive(:remove).with(@vis.shareable_id)
      @controller.send(:update_cache, @vis)
    end

    it 'adds the post from the cache if visibility is marked as hidden' do
      @vis.hidden = false
      @cache.should_receive(:add).with(@status.created_at.to_i, @vis.shareable_id)
      @controller.send(:update_cache, @vis)
    end
  end

  describe "#accessible_post" do
    it "memoizes a query for a post given a post_id param" do
      id = 1
      @controller.params[:post_id] = id
      Post.should_receive(:where).with(hash_including(:id => id)).once.and_return(stub.as_null_object)
      2.times do |n|
        @controller.send(:accessible_post)
      end
    end
  end
end
