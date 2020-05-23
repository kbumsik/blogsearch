TARGET = \
	dist/blogsearch.umd.js \
	dist/worker.umd.js \
	dist/blogsearch.wasm \
	$(CSS_THEME)
CSS_THEME = \
	dist/basic.css \
	dist/blue.css

# Top level build targets
all: $(TARGET)
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
	curl -LsSf 'https://cdn.jsdelivr.net/npm/sqlite-wasm@0.0.2/dist/sqlite-slim-fts5.wasm' -o $@
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
dist/%.css: src/styles/%.scss src/styles/_dropdown.scss
	node-sass --output-style expanded $< \
  	| postcss --use autoprefixer --map -o $(basename $@).css
	postcss $(basename $@).css --use cssnano --map -o $(basename $@).min.css

################################################################################
# Etc.
################################################################################
.PHONY: clean

clean:
	-find ./cache -type f \
		! -name '.gitignore' \
		-exec rm -f {} +
	-find ./dist -type f \
		! -name '.gitignore' \
		! -name '.npmignore' \
		-exec rm -f {} +
	-find ./lib -type f \
		! -name '.gitignore' \
		! -name '.npmignore' \
		-exec rm -f {} +
	-rm -f src/lib/sqlite-slim-fts5.wasm
