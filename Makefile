all: lib-in-docker examples-in-docker docs

# override -in-docker commond
.PHONY: all-in-docker
all-in-docker: all

# Docker configuration
# When multiple jobs running (e.g. make -j2) The interactive TTY is not available
NUM_JOBS = $(patsubst -j%,%,$(filter -j%,$(MAKEFLAGS)))
INTERACTIVE = $(if $(NUM_JOBS),,$(shell [ -t 0 ] && echo 1))
DOCKER_OPT = \
	--rm \
	-v $$(pwd):/build \
	$(if $(INTERACTIVE),-it,) \
	$(if $(CI),,-u $$(id -u):$$(id -g))

# Every commands can be run in a docker container when *-in-docker is appended.
# e.g make start => make start-in-docker,
#			make test => make test-docker
%-in-docker:
	docker run $(DOCKER_OPT) \
		kbumsik/emscripten \
		make $(patsubst %-in-docker,%,$@)

##############
# Common tasks
##############
install:
	yarn install

lib: blogsearch blogsearch-crawler
.PHONY: lib-in-docker
lib-in-docker: blogsearch-in-docker blogsearch-crawler-in-docker

test: blogsearch
	cd blogsearch && yarn test

start:
	cd examples/demo && yarn start
# Port 9000 is used by the webserver of examples/demo
start-in-docker: DOCKER_OPT += -p 9000:9000

.PHONY: examples
examples: crawler-reactjs crawler-kubernetes gatsby-reactjs jekyll-circleci demo
# override -in-docker command
.PHONY: examples-in-docker
examples-in-docker: crawler-reactjs-in-docker crawler-kubernetes-in-docker gatsby-reactjs-in-docker jekyll-circleci-in-docker demo-in-docker

.PHONY: docs
docs:
	cd docs && make all

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
crawler-reactjs: blogsearch-crawler
	cd examples/crawler-examples/reactjs.org && yarn build

crawler-kubernetes: blogsearch-crawler
	cd examples/crawler-examples/kubernetes.io && yarn build

gatsby-reactjs:
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
	docker build . --tag kbumsik/emscripten:$$(date +'%Y-%m-%d') --file $<

clean:
	cd blogsearch && yarn clean
	cd blogsearch-crawler && yarn clean
	cd examples/crawler-examples/reactjs.org && yarn clean
	cd examples/crawler-examples/kubernetes.io && yarn clean
	cd examples/gatsby-examples/reactjs.org && yarn clean
	cd examples/jekyll-examples/circleci-docs && yarn clean
	cd examples/demo && yarn clean

# Just to work in the docker container, so you can run bash-in-docker
bash:
	bash
