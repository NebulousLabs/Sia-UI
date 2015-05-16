all: run

dependencies:
	npm install electron-prebuilt

distribute:
	cp -R site/ node_modules/electron-prebuilt/dist/resources/app/
	cd node_modules/electron-prebuilt/dist/ && \
	mv electron Sia && \
	tar -cJvf ../../../test-ui-linux64.tar.xz * && \
	mv Sia electron

run:
	cp -R site/ node_modules/electron-prebuilt/dist/resources/app/
	./node_modules/electron-prebuilt/dist/electron

.PHONY: all depedencies run
