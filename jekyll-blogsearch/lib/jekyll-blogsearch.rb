require 'jekyll/hooks'
require 'jekyll/plugin'
require 'jekyll/generator'
require 'sqlite3'
require 'jekyll/blogsearch/version'
require "nokogiri"
require 'pp'

begin
  fields_config = {}
  db = {}
  rowid_counter = 0
  baseurl = ''

  # Start
  Jekyll::Hooks.register(:site, :post_read) do |site|
    # https://www.rubydoc.info/github/jekyll/jekyll/Jekyll/Site
    # pp site.config
    fields_config = site.config['blogsearch']['fields']
    
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
        title,
        body,
        url,
        categories,
        tags
      );
    SQL

    # FTS5 virtual table
    db.execute <<-SQL
      CREATE VIRTUAL TABLE blogsearch
      USING fts5 (
        title,
        body,
        url,
        categories,
        tags,
        tokenize = 'porter unicode61 remove_diacritics 1',
        content=blogsearch_ext_content,
        content_rowid=rowid
      );
    SQL
  end

  # End
  Jekyll::Hooks.register :site, :post_render do |site|
    db.close
  end

  # Post and etc.
  Jekyll::Hooks.register :documents, :post_render do |document|
    # https://www.rubydoc.info/github/jekyll/jekyll/Jekyll/Document
    # pp document.data
    # [TODO] Add support for document.data['excerpt']

    next if not document.published?
    rowid_counter += 1

    rowid = rowid_counter
    title = document.data['title']
    body = Nokogiri::HTML(document.content).text.to_s.gsub(/\s+/, ' ')
    url = baseurl + document.url
    categories = document.data['categories'].join(' , ')
    tags = document.data['tags'].join(' , ')

    # puts rowid, title, url, categories, tags
    # puts body

    # External content table
    db.execute <<-SQL,
      INSERT INTO blogsearch_ext_content
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      );
    SQL
    [rowid, title, body, url, categories, tags]
    
    # FTS5 virtual table
    db.execute <<-SQL,
      INSERT INTO blogsearch (
        rowid,
        title,
        body,
        url,
        categories,
        tags
      )
      VALUES (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
      );
    SQL
    [rowid, title, body, url, categories, tags]
  end

rescue => e
  puts e.message
end
