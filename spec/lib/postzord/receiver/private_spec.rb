#   Copyright (c) 2010-2011, Diaspora Inc.  This file is
#   licensed under the Affero General Public License version 3 or later.  See
#   the COPYRIGHT file.

require 'spec_helper'

require File.join(Rails.root, 'lib/postzord')
require File.join(Rails.root, 'lib/postzord/receiver/private')

describe Postzord::Receiver::Private do

  before do
    @alices_post = alice.build_post(:status_message, :text => "hey", :aspect_ids => [alice.aspects.first.id])
    @salmon_xml = alice.salmon(@alices_post).xml_for(bob.person)
  end

  describe '.initialize' do
    it 'valid for local' do
      Webfinger.should_not_receive(:new)
      Salmon::EncryptedSlap.should_not_receive(:from_xml)

      zord = Postzord::Receiver::Private.new(bob, :person => alice.person, :object => @alices_post)
      zord.instance_variable_get(:@user).should_not be_nil
      zord.instance_variable_get(:@sender).should_not be_nil
      zord.instance_variable_get(:@object).should_not be_nil
    end

    it 'valid for remote' do
      salmon_mock = mock()
      web_mock = mock()
      web_mock.should_receive(:fetch).and_return true
      salmon_mock.should_receive(:author_id).and_return(true)
      Salmon::EncryptedSlap.should_receive(:from_xml).with(@salmon_xml, bob).and_return(salmon_mock)
      Webfinger.should_receive(:new).and_return(web_mock)

      zord = Postzord::Receiver::Private.new(bob, :salmon_xml => @salmon_xml)
      zord.instance_variable_get(:@user).should_not be_nil
      zord.instance_variable_get(:@sender).should_not be_nil
      zord.instance_variable_get(:@salmon_xml).should_not be_nil
    end
  end

  describe '#receive!' do
    before do
      @zord = Postzord::Receiver::Private.new(bob, :salmon_xml => @salmon_xml)
      @salmon = @zord.instance_variable_get(:@salmon)
    end

    context 'returns false' do
      it 'if the salmon author does not exist' do
        @zord.instance_variable_set(:@sender, nil)
        @zord.receive!.should == false
      end

      it 'if the author does not match the signature' do
        @zord.instance_variable_set(:@sender, Factory(:person))
        @zord.receive!.should == false
      end
    end

    context 'returns the sent object' do
      it 'returns the received object on success' do
        @zord.receive!
        @zord.instance_variable_get(:@object).should respond_to(:to_diaspora_xml)
      end
    end

    it 'parses the salmon object' do
      Diaspora::Parser.should_receive(:from_xml).with(@salmon.parsed_data).and_return(@alices_post)
      @zord.receive!
    end
  end

  describe 'receive_object' do
    before do
      @zord = Postzord::Receiver::Private.new(bob, :person => alice.person, :object => @alices_post)
      @salmon = @zord.instance_variable_get(:@salmon)
    end

    it 'calls Notification.notify if object responds to notification_type' do
      cm = Comment.new
      cm.stub(:receive).and_return(cm)

      Notification.should_receive(:notify).with(bob, cm, alice.person)
      zord = Postzord::Receiver::Private.new(bob, :person => alice.person, :object => cm)
      zord.receive_object
    end

    it 'does not call Notification.notify if object does not respond to notification_type' do
      Notification.should_not_receive(:notify)
      @zord.receive_object
    end

    it 'calls receive on @object' do
      obj = @zord.instance_variable_get(:@object).should_receive(:receive)
      @zord.receive_object
    end
  end

  describe '#update_cache!' do
    it 'adds to redis cache if the contact has aspect visibilities' do
      @alices_post.save!

      @zord = Postzord::Receiver::Private.new(bob, :person => alice.person, :object => @alices_post)

      sort_order = "created_at"
      cache = RedisCache.new(bob, sort_order)
      RedisCache.should_receive(:new).with(bob, sort_order).and_return(cache)
      cache.should_receive(:add).with(@alices_post.created_at.to_i, @alices_post.id)
      @zord.update_cache!
    end

    it 'does not add to redis cache if the receiving user is not sharing with the sender' do
      alice.share_with(eve.person, alice.aspects.first)
      @alices_post.save!

      @zord = Postzord::Receiver::Private.new(eve, :person => alice.person, :object => @alices_post)

      sort_order = "created_at"
      RedisCache.should_not_receive(:new)
      @zord.update_cache!
    end
  end
end
