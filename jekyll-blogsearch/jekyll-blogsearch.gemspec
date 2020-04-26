# coding: utf-8
require File.join(__dir__, 'lib/jekyll/blogsearch/version.rb')

Gem::Specification.new do |spec|
  spec.name          = 'jekyll-blogsearch'
  spec.version       = Jekyll::BlogSearch::VERSION
  spec.authors       = ['Bumsik Kim']
  spec.email         = ['k.bumsik@gmail.com']

  spec.summary       = 'A simple search engine for your Jekyll website.'
  spec.homepage      = 'https://github.com/kbumsik/blogsearch'
  spec.licenses      = ['MIT']

  spec.add_development_dependency 'rake'
  spec.add_development_dependency 'rspec'
  spec.add_development_dependency 'guard-rspec'

  spec.add_dependency 'jekyll'
  spec.add_dependency 'sqlite3'
  spec.add_dependency 'nokogiri'

  spec.files = Dir[
    'lib/**/*.rb',
    'README.md',
    'LICENSE.txt',
  ]
end
