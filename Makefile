all: run

clean:
	rm -r electron-v* sia-v* Sia-*

dependencies:
	npm install electron-prebuilt

distributables:
	# Create the Linux distributable.
	wget -nc https://github.com/atom/electron/releases/download/v0.26.0/electron-v0.26.0-linux-x64.zip
	unzip -o electron-v0.26.0-linux-x64.zip -d Sia-Linux
	mv Sia-Linux/electron Sia-Linux/Sia
	cp -R site/ Sia-Linux/resources/app/
	tar -cJvf sia-v0.4.0-linux.tar.xz Sia-Linux
	# Create the Mac distributable.
	wget -nc https://github.com/atom/electron/releases/download/v0.26.0/electron-v0.26.0-darwin-x64.zip
	unzip -o electron-v0.26.0-darwin-x64.zip -d Sia-Mac
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
	tar -cJvf sia-v0.4.0-mac.tar.xz Sia-Mac
	# Create the Windows distributable.
	wget -nc https://github.com/atom/electron/releases/download/v0.26.0/electron-v0.26.0-win32-x64.zip
	unzip -o electron-v0.26.0-win32-x64.zip -d Sia-Windows
	mv Sia-Windows/electron.exe Sia-Windows/Sia.exe
	cp -R site/ Sia-Windows/resources/app/
	zip sia-v0.4.0-windows.zip Sia-Windows/*

run:
	cp -R site/ node_modules/electron-prebuilt/dist/resources/app/
	./node_modules/electron-prebuilt/dist/electron

.PHONY: all clean depedencies distributables run
