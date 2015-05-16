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
	tar -czvf sia-v0.4.0-linux.tar.gz Sia-Linux
	# Create the Mac distributable.
	#wget -nc https://github.com/atom/electron/releases/download/v0.26.0/electron-v0.26.0-darwin-x64.zip
	#unzip -o electron-v0.26.0-darwin-x64.zip -d Sia-Mac
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
