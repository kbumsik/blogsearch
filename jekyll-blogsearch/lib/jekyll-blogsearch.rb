require 'jekyll/hooks'
require 'jekyll/plugin'
require 'jekyll/generator'
require 'sqlite3'
require 'jekyll/blogsearch/version'
require "nokogiri"

begin
  db_path = 'blogsearch.db.bin'
  File.delete(db_path) if File.exist?(db_path)
  db = SQLite3::Database.new db_path
  rowid_counter = 0

  baseurl = Jekyll.configuration({})['baseurl'] ? Jekyll.configuration({})['baseurl']
    : Jekyll.configuration({})['url'] ? Jekyll.configuration({})['url']
    : ''

  # Start
  Jekyll::Hooks.register(:site, :post_read) do |site|
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
    # puts 'heyyyyyy'
    # puts site.posts
    db.close
  end

  # Post and etc.
  Jekyll::Hooks.register :documents, :post_render do |document|
    next if document.data['draft']
    rowid_counter += 1

    rowid = rowid_counter
    title = document.data['title']
    body = Nokogiri::HTML(document.content).text.to_s.gsub(/\s+/, ' ')
    url = baseurl + document.url
    categories = document.data['categories'].join(',')
    tags = document.data['tags'].join(',')

    # puts rowid, title, url, categories, tags

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
