#!/bin/bash

electronVersion=${1:-v1.3.7}
siaVersion=${2:-v1.0.1}
uiVersion=${3:-v1.0.2}

electronOSX="https://github.com/electron/electron/releases/download/v1.3.7/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/v1.3.7/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/v1.3.7/electron-${electronVersion}-win32-x64.zip"

siaOSX="https://github.com/NebulousLabs/Sia/releases/download/v1.0.1/Sia-${siaVersion}-darwin-amd64.zip"
siaLinux="https://github.com/NebulousLabs/Sia/releases/download/v1.0.1/Sia-${siaVersion}-linux-amd64.zip"
siaWindows="https://github.com/NebulousLabs/Sia/releases/download/v1.0.1/Sia-${siaVersion}-windows-amd64.zip"

rm -rf release/
mkdir release
mkdir release/osx
mkdir release/linux
mkdir release/windows

# package copies all the required javascript, html, and assets into an electron package.
package() {
	src=$1
	dest=$2
	cp -r ${src}/plugins $dest
	cp -r ${src}/assets $dest
	cp -r ${src}/css $dest
	cp -r ${src}/dist $dest
	cp -r ${src}/index.html $dest
	cp -r ${src}/package.json $dest
	cp -r ${src}/js $dest
}

# make osx release
cd release/osx
wget $electronOSX 
unzip ./electron*
mv Electron.app Sia-UI.app
rm -r Sia-UI.app/Contents/Resources/default_app.asar
mkdir Sia-UI.app/Contents/Resources/app
(
	cd Sia-UI.app/Contents/Resources/app
	wget $siaOSX
	unzip ./Sia-*
	rm ./Sia*.zip
	mv ./Sia-* ./Sia
)
package "../../" "Sia-UI.app/Contents/Resources/app"
rm -r electron*.zip
cp ../../LICENSE .
cd ../../

# make linux release
cd release/linux
wget $electronLinux
unzip ./electron*
mv electron Sia-UI
rm -r resources/default_app.asar
mkdir resources/app
(
	cd resources/app
	wget $siaLinux
	unzip ./Sia-*
	rm ./Sia*.zip
	mv ./Sia-* ./Sia
)
package "../../" "resources/app"
rm -r electron*.zip
cp ../../LICENSE .
cd ../../

# make windows release
cd release/windows
wget $electronWindows
unzip ./electron*
mv electron.exe Sia-UI.exe
rm resources/default_app.asar
mkdir resources/app
(
	cd resources/app
	wget $siaWindows
	unzip ./Sia-*
	rm ./Sia*.zip
	mv ./Sia-* ./Sia
)
package "../../" "resources/app"
cp ../../LICENSE .
rm -r electron*.zip
cd ../../

# make zip archives for each release
zip -r release/Sia-UI-${uiVersion}-win32-x64.zip release/windows
zip -r release/Sia-UI-${uiVersion}-darwin-x64.zip release/osx
zip -r release/Sia-UI-${uiVersion}-linux-x64.zip release/linux

