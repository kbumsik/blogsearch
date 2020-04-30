# This Makefile is to manage blogsearch assets and databases
BLOGSEARCH = \
	blogsearch.umd.js \
	worker.umd.js \
	blogsearch.wasm \
	blogsearch.css
BLOGSEARCH_ROOT = $(addprefix ../../blogsearch/dist/, $(BLOGSEARCH))
BLOGSEARCH_PUBLIC = $(addprefix ./public/, $(BLOGSEARCH))

DB = \
	reactjs.org.crawler-example.db.wasm \
	reactjs.org.gatsby-example.db.wasm \
	circleci-docs.jekyll-example.db.wasm
DB_PUBLIC = $(addprefix ./public/, $(DB))

# Build targests
all: blogsearch database

.PHONY: blogsearch
blogsearch: $(BLOGSEARCH_PUBLIC)

.PHONY: database
database: $(DB_PUBLIC)

# blogsearch build
./public/%: ../../blogsearch/dist/%
	cp $< $@

$(BLOGSEARCH_ROOT): blogsearch_root
.PHONY: blogsearch_root
blogsearch_root:
	cd ../../blogsearch && yarn build

# Database build
./public/reactjs.org.crawler-example.db.wasm: ../crawler-examples/reactjs.org/reactjs.org.crawler-example.db.wasm
	cp $< $@

./public/reactjs.org.gatsby-example.db.wasm: ../gatsby-examples/reactjs.org/reactjs.org.gatsby-example.db.wasm
	cp $< $@

./public/circleci-docs.jekyll-example.db.wasm: ../jekyll-examples/circleci-docs/circleci-docs.jekyll-example.db.wasm
	cp $< $@

../%.db.wasm:
	cd $(dir $@) && yarn build

# Clean
.PHONY: clean
clean: clean-blogsearch clean-database

.PHONY: clean-blogsearch
clean-blogsearch:
	rm -rf $(BLOGSEARCH_PUBLIC)

.PHONY: clean-database
clean-database:
	rm -rf $(DB_PUBLIC)
	cd ../crawler-examples/reactjs.org && yarn clean
	cd ../gatsby-examples/reactjs.org && yarn clean
