# Top level build targets
all: dist/blogsearch.umd.js dist/worker.umd.js dist/blogsearch.wasm dist/blogsearch.min.css
	@$(foreach target, $^, $(call print_size, $(target)))

define print_size
	printf '=> $(1)\tsize: %s\tgzipped: %s\n' \
		$$(cat $(1) | wc -c | numfmt --to=iec) \
		$$(gzip -9 < $(1) | wc -c | numfmt --to=iec);
endef

dist: WEBPACK_OPTS += --mode production
dist: all

debug: WEBPACK_OPTS += --mode development
debug: all

################################################################################
# Building JS
################################################################################
TS_SRC = $(shell \
	find src/lib/ -type f \
		-name '*.ts' \
		-not -path "*/__mocks__/*" \
		-not -path "*/__tests__/*")
# Basically: src/lib/*.ts => lib/*.js, except TypeScript .d.js files
JS_SRC = $(filter-out %.d.js, $(patsubst src/lib/%, lib/%, $(TS_SRC:%.ts=%.js)))

lib/%.js: src/lib/%.ts
	yarn build:ts

%.wasm: src/lib/sqlite-slim-fts5.wasm
	cp $< $@

src/lib/sqlite-slim-fts5.wasm:
	curl -LsSf 'https://cdn.jsdelivr.net/npm/sqlite-wasm@0.0.1/dist/sqlite-slim-fts5.wasm' -o $@
	# cp ../node_modules/sqlite-wasm/dist/sqlite-slim-fts5.wasm

#### UMD
# API
dist/blogsearch.umd.js: $(JS_SRC)
	webpack \
		--config webpack.config.js \
		$(WEBPACK_OPTS) \
		-o $@
# Worker
dist/worker.umd.js: $(JS_SRC)
	webpack \
		--config webpack.worker.config.js \
		$(WEBPACK_OPTS) \
		-o $@

################################################################################
# Building CSS
################################################################################
dist/blogsearch.css: src/styles/main.scss $(wildcard src/styles/*.scss)
	node-sass --output-style expanded $< \
  	| postcss --use autoprefixer -o $@

dist/blogsearch.min.map: dist/blogsearch.min.css
dist/blogsearch.min.css: dist/blogsearch.css
	postcss $< --use cssnano --map $(@:.css=.min.css) -o $@

################################################################################
# Etc.
################################################################################
.PHONY: clean

clean:
	-rm -rf dist
	-rm -rf lib
	-rm -rf lib-test
	-rm -f src/lib/sqlite-slim-fts5.wasm
