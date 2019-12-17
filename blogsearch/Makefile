SQLITE_VERSION := 3.30.1
SQLITE_SRC := ./sqlite/build-$(SQLITE_VERSION)/sqlite3.c

# Sqlite build
$(SQLITE_SRC):
	mkdir -p sqlite
	cd sqlite && wget https://www.sqlite.org/src/tarball/sqlite.tar.gz?r=version-$(SQLITE_VERSION) -O sqlite.tar.gz
	cd sqlite && tar xzf sqlite.tar.gz
	mkdir -p sqlite/build-$(SQLITE_VERSION)
	cd sqlite/build-$(SQLITE_VERSION) \
		&& ../sqlite/configure \
	 		--enable-fts5 \
	 		--disable-threadsafe \
			--disable-tcl \
			--disable-libtool-lock \
			--disable-largefile
	make -C sqlite/build-$(SQLITE_VERSION)
	emmake make -C sqlite/build-$(SQLITE_VERSION) sqlite3.c

.PHONY: clean

clean:
	rm -rf ./sqlite
