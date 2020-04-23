# Reference: https://www.gnu.org/software/make/manual/make.html

all: build-blogsearch build-crawlers build-examples

install-node-modules:
	cd blogsearch && yarn install
	cd blogsearch-crawler && yarn install

test: all
	cd blogsearch && yarn test

start: all
	cd examples/demo && yarn start

# blogsearch
build-blogsearch:
	cd blogsearch && yarn build && yarn test

# crawlers and plugins
build-crawlers: build-blogsearch-crawler

build-blogsearch-crawler:
	cd blogsearch-crawler && yarn build

# examples
build-examples: build-demo

build-demo: build-blogsearch build-crawlers
	cd examples/demo && yarn build

# Docker
build-using-docker:
	docker run \
			-v $$(realpath "$$(pwd)/.."):/build \
			-u $$(id -u):$$(id -g) \
			kbumsik/emscripten \
			make

build-docker-image:
	docker build --tag kbumsik/emscripten $$(pwd)/..

# etc.
clean:
	cd blogsearch && yarn clean
	cd blogsearch-crawler && yarn clean
	cd examples/demo && yarn clean
