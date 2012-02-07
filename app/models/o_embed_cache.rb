class OEmbedCache < ActiveRecord::Base
  serialize :data
  attr_accessible :url
  validates :data, :presence => true

  has_many :posts

  def self.find_or_create_by_url(url)
  end

  def fetch_and_save_oembed_data!
  end

  def is_trusted_and_has_html?
    self.from_trusted? and self.data.has_key?('html')
  end

  def from_trusted?
    SECURE_ENDPOINTS.include?(self.data['trusted_endpoint_url'])
  end

  def options_hash(prefix = 'thumbnail_')
    return nil
  end
end
