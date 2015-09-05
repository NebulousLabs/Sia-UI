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

package: rmpackages package-linux64 package-linux32 package-windows64 package-windows32 package-osx

rmpackages:
	rm -r $(release-dir)/$(sia-ui-name)*

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

electron-linux32 = electron-$(electron-version)-linux-ia32.zip
sia-linux32 = $(sia-ui-name)-$(sia-version)-linux32
package-linux32:
	mkdir -p $(release-dir)
	wget -nc $(electron-url)/$(electron-version)/$(electron-linux32) -O $(release-dir)/$(electron-linux32) || true
	unzip -o $(release-dir)/$(electron-linux32) -d $(release-dir)/$(sia-linux32)
	rm -r $(release-dir)/$(sia-linux32)/resources/default_app
	mv $(release-dir)/$(sia-linux32)/electron $(release-dir)/$(sia-linux32)/Sia
	cp -R app/ $(release-dir)/$(sia-linux32)/resources/app/
	mkdir -p $(release-dir)/$(sia-linux32)/resources/app/Sia
	tar -xzf $(sia-release-path)/Sia_$(sia-version)_linux_386.tar.gz -C $(release-dir)/$(sia-linux32)/resources/app/Sia --strip-components=1
	# With out the 'cd' command, the 'release' folder gets included in the
	# archive, which is undesirable. I couldn't figure out how to prevent that
	# using flags alone.
	cd $(release-dir) && tar -czf $(sia-linux32).tar.gz $(sia-linux32) && cd ..

electron-windows64 = electron-$(electron-version)-win32-x64.zip
sia-windows64 = $(sia-ui-name)-$(sia-version)-windows64
package-windows64:
	mkdir -p $(release-dir)
	wget -nc $(electron-url)/$(electron-version)/$(electron-windows64) -O $(release-dir)/$(electron-windows64) || true
	unzip -o $(release-dir)/$(electron-windows64) -d $(release-dir)/$(sia-windows64)
	rm -r $(release-dir)/$(sia-windows64)/resources/default_app
	mv $(release-dir)/$(sia-windows64)/electron.exe $(release-dir)/$(sia-windows64)/Sia.exe
	cp -R app/ $(release-dir)/$(sia-windows64)/resources/app/
	mkdir -p $(release-dir)/$(sia-windows64)/resources/app/Sia
	unzip $(sia-release-path)/Sia_$(sia-version)_windows_amd64.zip -d $(release-dir)/$(sia-windows64)/resources/app/Sia
	# With out the 'cd' command, the 'release' folder gets included in the
	# archive, which is undesirable. I couldn't figure out how to prevent that
	# using flags alone.
	cd $(release-dir) zip -r $(release-dir)/$(sia-windows64).zip $(release-dir)/$(sia-windows64) && cd ..

electron-windows32 = electron-$(electron-version)-win32-ia32.zip
sia-windows32 = $(sia-ui-name)-$(sia-version)-windows32
package-windows32:
	mkdir -p $(release-dir)
	wget -nc $(electron-url)/$(electron-version)/$(electron-windows32) -O $(release-dir)/$(electron-windows32) || true
	unzip -o $(release-dir)/$(electron-windows32) -d $(release-dir)/$(sia-windows32)
	rm -r $(release-dir)/$(sia-windows32)/resources/default_app
	mv $(release-dir)/$(sia-windows32)/electron.exe $(release-dir)/$(sia-windows32)/Sia.exe
	cp -R app/ $(release-dir)/$(sia-windows32)/resources/app/
	mkdir -p $(release-dir)/$(sia-windows32)/resources/app/Sia
	unzip $(sia-release-path)/Sia_$(sia-version)_windows_386.zip -d $(release-dir)/$(sia-windows32)/resources/app/Sia
	# With out the 'cd' command, the 'release' folder gets included in the
	# archive, which is undesirable. I couldn't figure out how to prevent that
	# using flags alone.
	cd $(release-dir) zip -r $(release-dir)/$(sia-windows32).zip $(release-dir)/$(sia-windows32) && cd ..

electron-osx = electron-$(electron-version)-darwin-x64.zip
sia-osx = $(sia-ui-name)-$(sia-version)-mac
contents = $(release-dir)/$(sia-osx)/Sia.app/Contents
package-osx:
	mkdir -p $(release-dir)
	wget -nc $(electron-url)/$(electron-version)/$(electron-osx) -O $(release-dir)/$(electron-osx) || true
	unzip -o $(release-dir)/$(electron-osx) -d $(release-dir)/$(sia-osx)
	### Rebranding ###
	mv $(release-dir)/$(sia-osx)/Electron.app $(release-dir)/$(sia-osx)/Sia.app
	mv $(contents)/MacOS/Electron $(contents)/MacOS/Sia
	mv $(contents)/Frameworks/Electron\ Helper\ EH.app/ $(contents)/Frameworks/Sia\ Helper\ EH.app
	mv $(contents)/Frameworks/Sia\ Helper\ EH.app/Contents/MacOS/Electron\ Helper\ EH $(contents)/Frameworks/Sia\ Helper\ EH.app/Contents/MacOS/Sia\ Helper\ EH
	mv $(contents)/Frameworks/Electron\ Helper\ NP.app/ $(contents)/Frameworks/Sia\ Helper\ NP.app
	mv $(contents)/Frameworks/Sia\ Helper\ NP.app/Contents/MacOS/Electron\ Helper\ NP $(contents)/Frameworks/Sia\ Helper\ NP.app/Contents/MacOS/Sia\ Helper\ NP
	mv $(contents)/Frameworks/Electron\ Helper.app/ $(contents)/Frameworks/Sia\ Helper.app
	mv $(contents)/Frameworks/Sia\ Helper.app/Contents/MacOS/Electron\ Helper $(contents)/Frameworks/Sia\ Helper.app/Contents/MacOS/Sia\ Helper
	sed -i.bak s/Electron/Sia/g $(contents)/Info.plist
	sed -i.bak s/Electron/Sia/g $(contents)/Frameworks/Sia\ Helper.app/Contents/Info.plist
	### End Rebranding ###
	rm -r $(release-dir)/$(sia-osx)/Sia.app/Contents/Resources/default_app
	cp -R app/ $(release-dir)/$(sia-osx)/Sia.app/Contents/Resources/app/
	mkdir -p $(release-dir)/$(sia-osx)/Sia.app/Contents/Resources/app/Sia
	unzip $(sia-release-path)/Sia_$(sia-version)_darwin_amd64.zip -d $(release-dir)/$(sia-osx)/Sia.app/Contents/Resources/app/Sia
	# With out the 'cd' command, the 'release' folder gets included in the
	# archive, which is undesirable. I couldn't figure out how to prevent that
	# using flags alone.
	cd $(release-dir) zip -r $(release-dir)/$(sia-osx).zip $(release-dir)/$(sia-osx) && cd ..

.PHONY: package rmpackages package-linux64 package-linux32 package-windows64 package-windows32 package-osx
