INDEX_FILES = \
	circleci-docs.jekyll-example.db.wasm \
	reactjs.org.crawler-example.db.wasm \
	reactjs.org.gatsby-example.db.wasm \
	kubernetes.io.crawler-example.db.wasm

ASSET_FILES = \
	bootstrap-litera.css

all: $(INDEX_FILES) $(ASSET_FILES)

%.db.wasm:
	make -C ../examples/demo public/$@
	cp ../examples/demo/public/$@ $@

%.css:
	cp ../examples/demo/public/$@ $@
