#!/bin/bash

# error output terminates this script
set -e

# This script creates a Sia-UI release for all 3 platforms: osx (darwin),
# linux, and windows. It takes 5 arguments, the first two arguments are the
# private and public key used to sign the release archives. The last three
# arguments are semver strings, the first of which being the ui version, second
# being the Sia version, and third being the electron version.

if [[ -z $1 || -z $2 ]]; then
	echo "Usage: $0 privatekey publickey uiversion siaversion electronversion"
	exit 1
fi

# ensure we have a clean node_modules
rm -rf ./node_modules
npm install

# build the UI's js
rm -rf ./dist
npm run build-production

uiVersion=${3:-v1.1.1}
siaVersion=${4:-v1.1.1}
electronVersion=${5:-v1.4.15}

# fourth argument is the public key file path.
keyFile=`readlink -f $1`
pubkeyFile=`readlink -f $2`


electronOSX="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-darwin-x64.zip"
electronLinux="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-linux-x64.zip"
electronWindows="https://github.com/electron/electron/releases/download/${electronVersion}/electron-${electronVersion}-win32-x64.zip"

siaOSX="https://github.com/NebulousLabs/Sia/releases/download/${siaVersion}/Sia-${siaVersion}-darwin-amd64.zip"
siaLinux="https://github.com/NebulousLabs/Sia/releases/download/${siaVersion}/Sia-${siaVersion}-linux-amd64.zip"
siaWindows="https://github.com/NebulousLabs/Sia/releases/download/${siaVersion}/Sia-${siaVersion}-windows-amd64.zip"

rm -rf release/
mkdir -p release/{osx,linux,win32}

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
	sed -i 's/>Electron</>Sia-UI</' Sia-UI.app/Contents/Info.plist 
	sed -i 's/>com.github.electron\</>com.nebulouslabs.siaui</' Sia-UI.app/Contents/Info.plist
	sed -i 's/>electron.icns</>icon.icns</' Sia-UI.app/Contents/Info.plist
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
	cd release/win32
	wget $electronWindows
	unzip ./electron*
	mv electron.exe Sia-UI.exe
	wget https://github.com/electron/rcedit/releases/download/v0.1.0/rcedit.exe
	wine rcedit.exe Sia-UI.exe --set-icon '../../assets/icon.ico'
	rm -f rcedit.exe
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
	rm -r electron*.zip
	cp ../../LICENSE .
}

# make osx release
( buildOSX )

# make linux release
( buildLinux )

# make windows release
( buildWindows )

# make signed zip archives for each release
for os in win32 linux osx; do 
	(
		cd release/${os}
		zip -r ../Sia-UI-${uiVersion}-${os}-x64.zip .
		cd ..
		openssl dgst -sha256 -sign $keyFile -out Sia-UI-${uiVersion}-${os}-x64.zip.sig Sia-UI-${uiVersion}-${os}-x64.zip
		if [[ -n $pubkeyFile ]]; then
			openssl dgst -sha256 -verify $pubkeyFile -signature Sia-UI-${uiVersion}-${os}-x64.zip.sig Sia-UI-${uiVersion}-${os}-x64.zip
		fi
		rm -rf release/${os}
	)
done

