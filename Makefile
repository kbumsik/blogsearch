# Reference: https://www.gnu.org/software/make/manual/make.html

all: build-blogsearch build-crawlers build-examples

# Every commands can be run in a docker container when *-in-docker is appended.
# e.g make all => make all-in-docker,
# 		make start => make start-in-docker,
#			make test => make test-docker
# Port 9000 is used by the webserver of examples/demo
%-in-docker:
	docker run -t -i --rm \
		-v $$(pwd):/build \
		-u $$(id -u):$$(id -g) \
		-p 9000:9000 \
		kbumsik/emscripten \
		make $(patsubst %-in-docker,%,$@)

# Common tasks
install:
	yarn install


test: all
	cd blogsearch && yarn test

start: all
	cd examples/demo && yarn start

# blogsearch
build-blogsearch:
	cd blogsearch && yarn build

# crawlers and plugins
build-crawlers: build-blogsearch-crawler

build-blogsearch-crawler:
	cd blogsearch-crawler && yarn build

# examples
build-examples: build-demo

build-demo: build-blogsearch build-crawlers
	cd examples/demo && yarn build

# etc.
build-docker-image:
	docker build --tag kbumsik/emscripten $$(pwd)/..

clean:
	cd blogsearch && yarn clean
	cd blogsearch-crawler && yarn clean
	cd examples/demo && yarn clean
