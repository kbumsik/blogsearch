all: build-blogsearch build-crawler build-demo

rebuild: clean install-node-modules all

demo: all
	cd ../examples/demo && yarn start

build-blogsearch:
	cd ../blogsearch && yarn build && yarn test

build-crawler:
	cd ../blogsearch-crawler && yarn build

build-demo: build-blogsearch build-crawler
	cd ../examples/demo && yarn build

install-node-modules:
	cd ../blogsearch && yarn install
	cd ../blogsearch-crawler && yarn install

clean:
	cd ../blogsearch && yarn clean
	cd ../blogsearch-crawler && yarn clean
	cd ../examples/demo && yarn clean

build-using-docker:
	docker run \
			-v $$(realpath "$$(pwd)/.."):/build \
			-u $$(id -u):$$(id -g) \
			kbumsik/emscripten \
			make -C scripts

build-docker-image:
	docker build --tag kbumsik/emscripten $$(pwd)/..

