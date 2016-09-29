#!/bin/bash

# error output terminates this script
set -e

# This script creates a Sia-UI release for all 3 platforms: osx (darwin),
# linux, and windows.  it takes 3 arguments, each one a version.  The first
# argument is the version used to label the Sia-UI release, the second argument
# is the Sia version to package, and the third argument is the Electron version
# to package.  The archives are written out to release/.

uiVersion=${1:-v1.0.2}
siaVersion=${2:-v1.0.1}
electronVersion=${3:-v1.3.7}

electronOSX="https://github.com/electron/electron/releases/download/v1.3.7/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/v1.3.7/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/v1.3.7/electron-${electronVersion}-win32-x64.zip"

siaOSX="https://github.com/NebulousLabs/Sia/releases/download/v1.0.1/Sia-${siaVersion}-darwin-amd64.zip"
siaLinux="https://github.com/NebulousLabs/Sia/releases/download/v1.0.1/Sia-${siaVersion}-linux-amd64.zip"
siaWindows="https://github.com/NebulousLabs/Sia/releases/download/v1.0.1/Sia-${siaVersion}-windows-amd64.zip"

rm -rf release/
mkdir -p release/{osx,linux,windows}

# package copies all the required javascript, html, and assets into an electron package.
package() {
	src=$1
	dest=$2
	cp -r ${src}/{plugins,assets,css,dist,index.html,package.json,js} $dest
}

buildOSX() {
	cd release/osx
	wget $electronOSX 
	unzip ./electron*
	mv Electron.app Sia-UI.app
	mv Sia-UI.app/Contents/MacOS/Electron Sia-UI.app/Contents/MacOS/Sia-UI
	# NOTE: this only works with GNU sed, other platforms (like OSX) may fail here
	sed -i 's/\>Electron\</\>Sia-UI\</' Sia-UI.app/Contents/Info.plist > Sia-UI.app/Contents/Info.plist
	sed -i 's/\>com.github.electron\</\>com.nebulouslabs.siaui\</' Sia-UI.app/Contents/Info.plist > Sia-UI.app/Contents/Info.plist
	sed -i  's/\>electron.icns\</\>icon.icns\</' Sia-UI.app/Contents/Info.plist > Sia-UI.app/Contents/Info.plist
	cp ../../assets/icon.icns Sia-UI.app/Contents/Resources/
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
}

buildLinux() {
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
}

buildWindows() {
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
}

# make osx release
( buildOSX )

# make linux release
( buildLinux )

# make windows release
( buildWindows )

# make zip archives for each release
cd release/windows
zip -r ../Sia-UI-${uiVersion}-win32-x64.zip .
cd ../osx
zip -r ../Sia-UI-${uiVersion}-darwin-x64.zip .
cd ../linux
zip -r ../Sia-UI-${uiVersion}-linux-x64.zip .

