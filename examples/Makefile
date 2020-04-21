
reactjs.org/public:
	git submodule update --init reactjs.org
	cd ./reactjs.org \
		&& yarn upgrade \
		&& yarn install \
		&& yarn build

clean:
	cd reactjs.org/public && git reset --hard HEAD && git clean -fdx
