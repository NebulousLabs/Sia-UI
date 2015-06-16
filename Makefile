# Version control
electron-version = v0.28.0
sia-version = v0.4.0

all: run

clean:
	rm -rf electron-$(electron-version)* sia-v* Sia-*

dependencies:
	npm install electron-prebuilt
	rm -rf node_modules/electron-prebuilt/dist/resources/default_app

run:
	rm -rf node_modules/electron-prebuilt/dist/resources/app/
	cp -R site/ node_modules/electron-prebuilt/dist/resources/app/
	./node_modules/electron-prebuilt/dist/electron

dist-linux-32:
	wget -nc https://github.com/atom/electron/releases/download/$(electron-version)/electron-$(electron-version)-linux-ia32.zip
	unzip -o electron-$(electron-version)-linux-ia32.zip -d Sia-Linux-ia32
	mv Sia-Linux-ia32/electron Sia-Linux-ia32/Sia
	cp -R site/ Sia-Linux-ia32/resources/app/
	tar -cJvf sia-$(sia-version)-linux-ia32.tar.xz Sia-Linux-ia32

dist-linux-64:
	wget -nc https://github.com/atom/electron/releases/download/$(electron-version)/electron-$(electron-version)-linux-x64.zip
	unzip -o electron-$(electron-version)-linux-x64.zip -d Sia-Linux-x64
	mv Sia-Linux-x64/electron Sia-Linux-x64/Sia
	cp -R site/ Sia-Linux-x64/resources/app/
	tar -cJvf sia-$(sia-version)-linux-x64.tar.xz Sia-Linux-x64

dist-mac:
	wget -nc https://github.com/atom/electron/releases/download/$(electron-version)/electron-$(electron-version)-darwin-x64.zip
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
	cp -R site/ Sia-Mac/Sia.app/Contents/Resources/app/
	sed -i.bak s/Electron/Sia/g Sia-Mac/Sia.app/Contents/Info.plist
	sed -i.bak s/Electron/Sia/g Sia-Mac/Sia.app/Contents/Frameworks/Sia\ Helper.app/Contents/Info.plist
	tar -cJvf sia-$(sia-version)-mac.tar.xz Sia-Mac

dist-windows-32:
	wget -nc https://github.com/atom/electron/releases/download/$(electron-version)/electron-$(electron-version)-win32-ia32.zip
	unzip -o electron-$(electron-version)-win32-ia32.zip -d Sia-Windows-ia32
	mv Sia-Windows-ia32/electron.exe Sia-Windows-ia32/Sia.exe
	cp -R site/ Sia-Windows-ia32/resources/app/
	zip sia-$(sia-version)-windows-ia32.zip Sia-Windows-ia32/*

dist-windows-64:
	wget -nc https://github.com/atom/electron/releases/download/$(electron-version)/electron-$(electron-version)-win32-x64.zip
	unzip -o electron-$(electron-version)-win32-x64.zip -d Sia-Windows-x64
	mv Sia-Windows-x64/electron.exe Sia-Windows-x64/Sia.exe
	cp -R site/ Sia-Windows-x64/resources/app/
	zip sia-$(sia-version)-windows-x64.zip Sia-Windows-x64/*

dist: dist-linux-32 dist-linux-64 dist-mac dist-windows-32 dist-windows-64

.PHONY: all clean dependencies run dist-linux-32 dist-linux-64 dist-mac dist-windows-32 dist-windows-64 dist
