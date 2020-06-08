DB = \
	reactjs.org.crawler-example \
	reactjs.org.gatsby-example \
	circleci-docs.jekyll-example \
	kubernetes.io.crawler-example
DB_FILES = $(addsuffix .db.wasm, $(DB))
DB_FILES += $(addsuffix .slim.db.wasm, $(DB))

ASSET_FILES = \
	bootstrap-litera.css

all: $(DB_FILES) $(ASSET_FILES)

%.db.wasm:
	make -C ../examples/demo public/$@
	cp ../examples/demo/public/$@ $@

%.css:
	cp ../examples/demo/public/$@ $@
