require 'jekyll/hooks'
require 'jekyll/plugin'
require 'jekyll/generator'
require 'sqlite3'
require 'jekyll/blogsearch/version'
require 'nokogiri'

begin
  fields_config = {}
  db = {}
  rowid_counter = 0
  baseurl = ''
  default_config = {
    'title' => {
      'enabled' => true,
      'indexed' => true,
      'hasContent' => true,
    },
    'body' => {
      'enabled' => true,
      'indexed' => true,
      'hasContent' => true,
    },
    'url' => {
      'enabled' => true,
      'indexed' => false,
      'hasContent' => true,
    },
    'categories' => {
      'enabled' => true,
      'indexed' => true,
      'hasContent' => true,
    },
    'tags' => {
      'enabled' => true,
      'indexed' => true,
      'hasContent' => true,
    },
  }

  # Start
  Jekyll::Hooks.register(:site, :post_read) do |site|
    # https://www.rubydoc.info/github/jekyll/jekyll/Jekyll/Site
    fields_config = default_config.merge(site.config['blogsearch']['fields'])
                                  .keep_if { |_, config| config['enabled'] }

    db_path = site.config['blogsearch']['output']
    db_dir = File.dirname(db_path)
    Dir.mkdir(db_dir) if not Dir.exist?(db_dir)
    File.delete(db_path) if File.exist?(db_path)
    db = SQLite3::Database.new db_path

    if site.config['blogsearch']['fields']['url'].key?('base')
      baseurl = site.config['blogsearch']['fields']['url']['base']
    else 
      baseurl = site.config['url'] ? site.config['url'] : ''
      baseurl += site.config['baseurl'] ? site.config['baseurl'] : ''
    end

    # External content table
    db.execute <<-SQL
      CREATE TABLE blogsearch_ext_content (
        rowid INTEGER PRIMARY KEY,
        #{fields_config.keys.map{ |field| field + (fields_config[field]['indexed'] ? '' : ' UNINDEXED') }.join(',')}
      );
    SQL

    # FTS5 virtual table
    db.execute <<-SQL
      CREATE VIRTUAL TABLE blogsearch
      USING fts5 (
        #{ fields_config.keys.join(',') },
        tokenize = 'porter unicode61 remove_diacritics 1',
        content=blogsearch_ext_content,
        content_rowid=rowid
      );
    SQL

    # Add 'rowid' block to match contents hash when inserted to the db.
    fields_config['rowid'] = {
      'enabled' => true,
      'indexed' => false,
      'hasContent' => true,
    }
  end

  # End
  Jekyll::Hooks.register :site, :post_render do |site|
    db.close
  end

  # Post and etc.
  Jekyll::Hooks.register :documents, :post_render do |document|
    # https://www.rubydoc.info/github/jekyll/jekyll/Jekyll/Document
    # [TODO] Add support for document.data['excerpt']

    next if not document.published?
    rowid_counter += 1

    contents = {
      'rowid' => rowid_counter,
      'title' => document.data['title'],
      'body' => Nokogiri::HTML(document.content).text.to_s.gsub(/\s+/, ' '),
      'url' => baseurl + document.url,
      'categories' => document.data['categories'].join(' , '),
      'tags' => document.data['tags'].join(' , '),
    }.keep_if { |field, _| fields_config.has_key?(field) }

    # FTS5 virtual table
    db.execute <<-SQL,
      INSERT INTO blogsearch (
        #{ contents.keys.join(',') }
      )
      VALUES (
        #{ contents.keys.map { |_| '?' }.join(',') }
      );
    SQL
    contents.values

    contents = contents.map { |field, value| [field, fields_config[field]['hasContent'] ? value : ''] }.to_h
    # External content table
    db.execute <<-SQL,
      INSERT INTO blogsearch_ext_content
      VALUES (
        #{ contents.keys.map { |_| '?' }.join(',') }
      );
    SQL
    contents.values
  end

rescue => e
  puts e.message
end
