if RUBY_VERSION =~ /1.9/
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8
end

source 'http://rubygems.org'

gem 'rails', '3.0.11'

gem 'bundler', '>= 1.0.0'
gem 'foreman', '0.34.1'
gem 'whenever'

gem 'thin'

gem 'whatlanguage'
gem 'htmlentities'

gem 'em-synchrony', :platforms => :ruby_19
gem 'em-websocket', :git => 'git://github.com/igrigorik/em-websocket.git'

# authentication

gem 'devise', '~> 1.3.1'
gem 'devise_invitable', '0.5.0'
gem 'jwt'
gem 'oauth2-provider', '0.0.19'

gem 'omniauth', '1.0.1'
gem 'omniauth-facebook'
gem 'omniauth-tumblr'
gem 'omniauth-twitter'

gem 'twitter'

gem 'jammit'

# mail

gem 'messagebus_ruby_api', '1.0.3'
gem "rpm_contrib", "~> 2.1.7"

group :production do # we don't install these on travis to speed up test runs
  gem 'rack-ssl', :require => 'rack/ssl'
end

# configuration

group :heroku do
  gem 'unicorn', '~> 4.1.1', :require => false
end

gem 'settingslogic', :git => 'git://github.com/binarylogic/settingslogic.git'
# database

gem 'activerecord-import'
gem 'foreigner', '~> 1.1.0'
gem 'mysql2', '0.2.18' if ENV['DB'].nil? || ENV['DB'] == 'all' || ENV['DB'] == 'mysql'
gem 'sqlite3' if ENV['DB'] == 'all' || ENV['DB'] == 'sqlite'

# file uploading

gem 'carrierwave', '0.5.8'
gem 'fog'
gem 'fastercsv', '1.5.4', :require => false
gem 'mini_magick', '3.4'
gem 'rest-client', '1.6.7'

# JSON and API

gem 'json'
gem 'acts_as_api'
gem 'vanna', :git => 'git://github.com/MikeSofaer/vanna.git'

# localization

gem 'i18n-inflector-rails', '~> 1.0'
gem 'rails-i18n'

# parsing

gem 'nokogiri'
gem 'redcarpet', :git => 'https://github.com/tanoku/redcarpet.git'
gem 'roxml', :git => 'git://github.com/Empact/roxml.git'
gem 'ruby-oembed'

# queue

gem 'resque'
gem 'resque-ensure-connected', :git => 'https://github.com/socialcast/resque-ensure-connected.git'
gem 'resque-timeout'

# tags

gem 'acts-as-taggable-on', :git => 'git://github.com/diaspora/acts-as-taggable-on.git'

# URIs and HTTP

gem 'addressable', :require => 'addressable/uri'
gem 'http_accept_language', '~> 1.0.2'
gem 'typhoeus'

# views

gem 'haml'
gem 'mobile-fu'
gem 'sass'
gem 'will_paginate'
gem 'client_side_validations'

# web

gem 'faraday'
gem 'faraday-stack'
gem 'em-synchrony', :platforms => :ruby_19

# jazzy jasmine

gem 'jasmine', '~> 1.1.2'

### GROUPS ####

group :test do
  gem 'capybara', '~> 1.1.2'
  gem 'cucumber-rails', '1.2.1', :require => false
  gem 'cucumber-api-steps', '0.6', :require => false
  gem 'database_cleaner', '0.7.1'
  gem 'diaspora-client', :git => 'git://github.com/diaspora/diaspora-client.git'

  gem 'timecop'
                          #"0.1.0", #:path => '~/workspace/diaspora-client'
  gem 'factory_girl_rails'
  gem 'fixture_builder', '0.3.1'
  gem 'fuubar', '0.0.6'
  gem 'mongrel', :require => false, :platforms => :ruby_18
  gem 'rspec', '>= 2.0.0'
  gem 'rspec-core', '~> 2.8.0'
  gem 'rspec-instafail', '>= 0.1.7', :require => false
  gem 'rspec-rails', '>= 2.0.0'
  gem 'selenium-webdriver'
  gem 'webmock', :require => false
  gem 'sqlite3'
  gem 'mock_redis'
end

group :development do
  gem 'heroku'
  gem 'heroku_san'
  gem 'capistrano', '~> 2.9.0', :require => false
  gem 'capistrano_colors', :require => false
  gem 'capistrano-ext', '1.2.1', :require => false
  gem 'linecache', '0.46', :platforms => :mri_18
  gem 'parallel_tests', :require => false
  gem 'ruby-debug-base19', '0.11.23' if RUBY_VERSION.include? '1.9.1'
  gem 'ruby-debug19', :platforms => :ruby_19
  gem 'ruby-debug', :platforms => :mri_18
  gem 'yard', :require => false

  # speed up development requests (already pulled into rails 3.2)
  gem 'active_reload'
end
