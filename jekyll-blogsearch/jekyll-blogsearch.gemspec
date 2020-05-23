# coding: utf-8
require File.join(__dir__, 'lib/jekyll/blogsearch/version.rb')

Gem::Specification.new do |spec|
  spec.name          = 'jekyll-blogsearch'
  spec.version       = Jekyll::BlogSearch::VERSION
  spec.authors       = ['Bumsik Kim']
  spec.email         = 'k.bumsik@gmail.com'

  spec.summary       = 'BlogSearch index building tool for Jekyll'
  spec.homepage      = 'https://github.com/kbumsik/blogsearch'
  spec.licenses      = 'MIT'

  spec.add_runtime_dependency 'jekyll'
  spec.add_runtime_dependency 'sqlite3', '~> 1.4'
  spec.add_runtime_dependency 'nokogiri', '~> 1.10'

  spec.files = Dir[
    'lib/**/*.rb',
    'README.adoc',
  ]
end
