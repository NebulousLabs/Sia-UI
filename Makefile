# Version control
electron-version = v0.28.1
electron-download-page = https://github.com/atom/electron/releases/download/${electron-version}/electron-$(electron-version)
sia-ui-version = v0.4.0
sia-repo = $(GOPATH)/src/github.com/NebulousLabs/Sia
sia-version = v0.3.3.3-beta
sia-download-page = https://github.com/NebulousLabs/Sia/releases/download/${sia-version}
project = "Sia-UI" ${sia-ui-version}
ui-path := $(shell pwd)
sia-ui-dependencies = $(ui-path)/app/dependencies

# runs the app
all: run

run:
	npm start

# simulates a fresh execution
run-fresh: clean dependencies run

# cleans distributable files & dependencies
clean:
	rm -rf electron-* sia-v* Sia-* node_modules $(sia-ui-dependencies) app/config.json **/*.swp npm-debug.log

# install tools needed to run
dependencies:
	test -d $(sia-repo) || go get -u github.com/NebulousLabs/Sia/...
	(cd $(sia-repo) && git fetch && git checkout $(sia-version) \
		&& make dependencies && make \
		&& test -d $(sia-ui-dependencies)/Sia || mkdir -p $(sia-ui-dependencies)/Sia \
		&& cp $(GOPATH)/bin/siad $(sia-ui-dependencies)/Sia)
	npm install

# make distributables for each operating system, folders and executable files
dist: dist-linux-32 dist-linux-64 dist-mac dist-windows-32 dist-windows-64

dist-linux-32:
	wget -nc $(electron-download-page)-linux-ia32.zip
	unzip -o electron-$(electron-version)-linux-ia32.zip -d Sia-Linux-ia32
	mv Sia-Linux-ia32/electron Sia-Linux-ia32/Sia
	cp -R app/ Sia-Linux-ia32/resources/app/
	tar -cJvf sia-$(sia-ui-version)-linux-ia32.tar.xz Sia-Linux-ia32

dist-linux-64:
	wget -nc $(electron-download-page)-linux-x64.zip
	unzip -o electron-$(electron-version)-linux-x64.zip -d Sia-Linux-x64
	mv Sia-Linux-x64/electron Sia-Linux-x64/Sia
	cp -R app/ Sia-Linux-x64/resources/app/
	tar -cJvf sia-$(sia-ui-version)-linux-x64.tar.xz Sia-Linux-x64

dist-mac:
	wget -nc $(electron-download-page)-darwin-x64.zip
	rm -rf Sia-Mac
	unzip electron-$(electron-version)-darwin-x64.zip -d Sia-Mac
	mv Sia-Mac/Electron.app/ Sia-Mac/Sia.app/
	mv Sia-Mac/Sia.app/Contents/MacOS/Electron Sia-Mac/Sia.app/Contents/MacOS/Sia
	mv Sia-Mac/Sia.app/Contents/Frameworks/Electron\ Helper\ EH.app/ Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper\ EH.app/
	mv Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper\ EH.app/Contents/MacOS/Electron\ Helper\ EH Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper\ EH.app/Contents/MacOS/Sia\ Helper\ EH
	mv Sia-Mac/Sia.app/Contents/Frameworks/Electron\ Helper\ NP.app/ Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper\ NP.app/
	mv Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper\ NP.app/Contents/MacOS/Electron\ Helper\ NP Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper\ NP.app/Contents/MacOS/Sia\ Helper\ NP
	mv Sia-Mac/Sia.app/Contents/Frameworks/Electron\ Helper.app/ Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper.app/
	mv Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper.app/Contents/MacOS/Electron\ Helper Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper.app/Contents/MacOS/Sia\ Helper
	cp -R app/ Sia-Mac/Sia.app/Contents/Resources/app/
	sed -i.bak s/Electron/Sia/g Sia-Mac/Sia.app/Contents/Info.plist
	sed -i.bak s/Electron/Sia/g Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper.app/Contents/Info.plist
	tar -cJvf sia-$(sia-ui-version)-mac.tar.xz Sia-Mac

dist-windows-32:
	wget -nc $(electron-download-page)-win32-ia32.zip
	unzip -o electron-$(electron-version)-win32-ia32.zip -d Sia-Windows-ia32
	mv Sia-Windows-ia32/electron.exe Sia-Windows-ia32/Sia.exe
	cp -R app/ Sia-Windows-ia32/resources/app/
	zip sia-$(sia-ui-version)-windows-ia32.zip Sia-Windows-ia32/*

dist-windows-64:
	wget -nc $(electron-download-page)-win32-x64.zip
	unzip -o electron-$(electron-version)-win32-x64.zip -d Sia-Windows-x64
	mv Sia-Windows-x64/electron.exe Sia-Windows-x64/Sia.exe
	cp -R app/ Sia-Windows-x64/resources/app/
	zip sia-$(sia-ui-version)-windows-x64.zip Sia-Windows-x64/*

.PHONY: all clean dependencies dist dist-linux-32 dist-linux-64 dist-mac dist-windows-32 dist-windows-64 run run-fresh
