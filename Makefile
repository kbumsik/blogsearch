all: lib-in-docker examples-in-docker

# override -in-docker commond
.PHONY: all-in-docker
all-in-docker: all

# Every commands can be run in a docker container when *-in-docker is appended.
# e.g make start => make start-in-docker,
#			make test => make test-docker
# Port 9000 is used by the webserver of examples/demo
INTERACTIVE:=$(shell [ -t 0 ] && echo 1)

%-in-docker:
	docker run --rm $(if $(INTERACTIVE), -it, ) \
		-v $$(pwd):/build \
		$(if $(CI), , -u $$(id -u):$$(id -g)) \
		-p 9000:9000 \
		kbumsik/emscripten \
		make $(patsubst %-in-docker,%,$@)

##############
# Common tasks
##############
install:
	yarn install

lib: blogsearch blogsearch-crawler

test: blogsearch
	cd blogsearch && yarn test

start: demo
	cd examples/demo && yarn start

.PHONY: examples
examples: gatsby-reactjs jekyll-circleci demo
# override -in-docker command
.PHONY: examples-in-docker
examples-in-docker: gatsby-reactjs-in-docker jekyll-circleci demo-in-docker

#######################
# Libray build commands
#######################
.PHONY: blogsearch
blogsearch:
	cd blogsearch && yarn build

.PHONY: blogsearch-crawler
blogsearch-crawler:
	cd blogsearch-crawler && yarn build

################
# Example builds
################
gatsby-reactjs: blogsearch-crawler
	cd examples/gatsby-examples/reactjs.org && yarn build

jekyll-circleci:
	cd examples/jekyll-examples/circleci-docs && yarn build
# Override -in-docker command because circleci needs its own docker
.PHONY: jekyll-circleci-in-docker
jekyll-circleci-in-docker: jekyll-circleci

demo: blogsearch
	cd examples/demo && yarn build

######
# etc.
######
docker-image: Dockerfile
	docker build --tag kbumsik/emscripten -f $<

clean:
	cd blogsearch && yarn clean
	cd blogsearch-crawler && yarn clean
	cd examples/demo && yarn clean

# Just to work in the docker container, so you can run bash-in-docker
bash:
	bash
