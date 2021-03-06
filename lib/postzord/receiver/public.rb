# Copyright (c) 2010-2011, Diaspora Inc. This file is
# licensed under the Affero General Public License version 3 or later. See
# the COPYRIGHT file.

class Postzord::Receiver::Public < Postzord::Receiver

  attr_accessor :salmon, :author

  def initialize(xml)
    @salmon = Salmon::Slap.from_xml(xml)
    @author = Webfinger.new(@salmon.author_id).fetch
  end

  # @return [Boolean]
  def verified_signature?
    if @author
      @salmon.verified_for_key?(@author.public_key)
    else
      false
    end
  end

  # @return [void]
  def receive!
    return false unless verified_signature?
    return false unless save_object

    if @object.respond_to?(:relayable?)
      receive_relayable
    else
      Resque.enqueue(Jobs::ReceiveLocalBatch, @object.class.to_s, @object.id, self.recipient_user_ids)
      true
    end
  end

  # @return [Object]
  def receive_relayable
    if @object.parent.author.local?
      # receive relayable object only for the owner of the parent object
      @object.receive(@object.parent.author.owner, @author)
    end
    # notify everyone who can see the parent object
    receiver = Postzord::Receiver::LocalBatch.new(@object, self.recipient_user_ids)
    receiver.notify_users
    @object
  end

  # @return [Object]
  def save_object
    @object = Diaspora::Parser::from_xml(@salmon.parsed_data)
    raise "Object is not public" if object_can_be_public_and_it_is_not?
    begin
      @object.save if @object
    rescue ActiveRecord::RecordNotUnique
      Rails.logger.info "Received object (#{@object.class} guid #{@object.guid}) already in local DB."
      nil
    end
  end

  # @return [Array<Integer>] User ids
  def recipient_user_ids
    User.all_sharing_with_person(@author).select('users.id').map!{ |u| u.id }
  end

  private

  # @return [Boolean]
  def object_can_be_public_and_it_is_not?
    @object.respond_to?(:public) && !@object.public?
  end
end