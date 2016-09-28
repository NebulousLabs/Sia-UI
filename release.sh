#!/bin/bash

# This script creates a Sia-UI release for all 3 platforms: osx (darwin),
# linux, and windows.  it takes 3 arguments, each one a version.  The first
# argument is the electron version to package, the second argument is the Sia
# version to package, and the third argument is version used to label the
# Sia-UI release.  The archives are written out to release/.

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
mv Sia-UI.app/Contents/MacOS/Electron Sia-UI.app/Contents/MacOS/Sia-UI
sed -i '' 's/\>Electron\</\>Sia-UI\</' Sia-UI.app/Contents/Info.plist > Sia-UI.app/Contents/Info.plist
sed -i '' 's/\>com.github.electron\</\>com.nebulouslabs.siaui\</' Sia-UI.app/Contents/Info.plist > Sia-UI.app/Contents/Info.plist
sed -i '' 's/\>electron.icns\</\>icon.icns\</' Sia-UI.app/Contents/Info.plist > Sia-UI.app/Contents/Info.plist
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
cd release/windows
zip -r ../Sia-UI-${uiVersion}-win32-x64.zip .
cd ../osx
zip -r ../Sia-UI-${uiVersion}-darwin-x64.zip .
cd ../linux
zip -r ../Sia-UI-${uiVersion}-linux-x64.zip .

