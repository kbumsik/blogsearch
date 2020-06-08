# This Makefile is to manage blogsearch assets and databases
BLOGSEARCH = \
	blogsearch.umd.js \
	worker.umd.js \
	blogsearch.wasm \
	basic.css \
	blue.css

BLOGSEARCH_ROOT = $(addprefix ../../blogsearch/dist/, $(BLOGSEARCH))
BLOGSEARCH_PUBLIC = $(addprefix ./public/, $(BLOGSEARCH))

DB = \
	reactjs.org.crawler-example \
	reactjs.org.gatsby-example \
	circleci-docs.jekyll-example \
	kubernetes.io.crawler-example
DB_FILES = $(addsuffix .db.wasm, $(DB))
DB_FILES += $(addsuffix .slim.db.wasm, $(DB))
DB_PUBLIC = $(addprefix ./public/, $(DB_FILES))

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
./public/reactjs.org.crawler-example%.db.wasm: ../crawler-examples/reactjs.org/reactjs.org.crawler-example%.db.wasm
	cp $< $@

./public/kubernetes.io.crawler-example%.db.wasm: ../crawler-examples/kubernetes.io/kubernetes.io.crawler-example%.db.wasm
	cp $< $@

./public/reactjs.org.gatsby-example%.db.wasm: ../gatsby-examples/reactjs.org/reactjs.org.gatsby-example%.db.wasm
	cp $< $@

./public/circleci-docs.jekyll-example%.db.wasm: ../jekyll-examples/circleci-docs/circleci-docs.jekyll-example%.db.wasm
	cp $< $@

../%.db.wasm:
	cd $(dir $@) && yarn build

# Clean
clean:
	rm -rf $(DB_PUBLIC)
	rm -rf $(BLOGSEARCH_PUBLIC)
