# This Makefile should really be a bash script, but I don't know how to make
# bash scripts that have multiple options, and since we're under deadline
# pressure I've elected not to learn.
all: package

release-dir = release
electron-url = https://github.com/atom/electron/releases/download
electron-version = v0.31.2
sia-ui-name = Sia-UI
sia-version = v0.4.1-beta
sia-release-path = $(GOPATH)/src/github.com/NebulousLabs/Sia/release/$(sia-version)

package: package-linux64

electron-linux64 = electron-$(electron-version)-linux-x64.zip
sia-linux64 = $(sia-ui-name)-$(sia-version)-linux64
package-linux64:
	mkdir -p $(release-dir)
	wget -nc $(electron-url)/$(electron-version)/$(electron-linux64) -O $(release-dir)/$(electron-linux64) || true
	unzip -o $(release-dir)/$(electron-linux64) -d $(release-dir)/$(sia-linux64)
	rm -r $(release-dir)/$(sia-linux64)/resources/default_app
	mv $(release-dir)/$(sia-linux64)/electron $(release-dir)/$(sia-linux64)/Sia
	cp -R app/ $(release-dir)/$(sia-linux64)/resources/app/
	mkdir -p $(release-dir)/$(sia-linux64)/resources/app/Sia
	tar -xzf $(sia-release-path)/Sia_$(sia-version)_linux_amd64.tar.gz -C $(release-dir)/$(sia-linux64)/resources/app/Sia --strip-components=1
	# With out the 'cd' command, the 'release' folder gets included in the
	# archive, which is undesirable. I couldn't figure out how to prevent that
	# using flags alone.
	cd $(release-dir) && tar -czf $(sia-linux64).tar.gz $(sia-linux64) && cd ..

.PHONY: package package-linux64
	
