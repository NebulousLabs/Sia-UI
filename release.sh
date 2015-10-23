#!/bin/bash
#
# Packages the UI with its corresponding Sia release.

# constants
readonly RELEASE_DIR="release"
readonly ELECTRON_URL="https://github.com/atom/electron/releases/download"
readonly ELECTRON_VERSION="v0.33.9"
readonly SIA_UI_NAME="Sia-UI"
readonly SIA_VERSION="v0.4.5-beta"
readonly SIA_UI_VERSION="v0.4.7-beta"
readonly SIA_RELEASE_DIR="$GOPATH/src/github.com/NebulousLabs/Sia/release/$SIA_VERSION"

# generic packaging function
package() {
	# Define local variables.
	local electron_arch=""
	local sia_arch=""
	case "$1" in
		linux64)
			electron_arch="linux-x64"
			sia_arch="linux_amd64"
			;;
		linux32)
			electron_arch="linux-ia32"
			sia_arch="linux_386"
			;;
		win64)
			electron_arch="win32-x64"
			sia_arch="windows_amd64"
			;;
		win32)
			electron_arch="win32-ia32"
			sia_arch="windows_386"
			;;
		darwin)
			electron_arch="darwin-x64"
			sia_arch="darwin_amd64"
	esac
	local zip_path="electron-$ELECTRON_VERSION-$electron_arch.zip"
	local ui="$SIA_UI_NAME-$SIA_UI_VERSION-$1"
	echo "Creating $ui..."

	# Download an electron binary (if it hasn't already been downloaded),
	# unzip it, and create the app's directory structure.
	wget -nc -q "$ELECTRON_URL/$ELECTRON_VERSION/$zip_path" -O "$zip_path" || true
	unzip -quo "$zip_path" -d "$ui"
	
	if [[ $1 == "darwin" ]]; then
		mv "$ui/Electron.app" "$ui/Sia.app"
		rm -r "$ui/Sia.app/Contents/Resources/default_app"
		cp -R ../app/ "$ui/Sia.app/Contents/Resources/app/"
		mkdir -p "$ui/Sia.app/Contents/Resources/app/Sia"
		# Rebranding
		local contents="$ui/Sia.app/Contents"
		mv "$contents"/MacOS/Electron "$contents"/MacOS/Sia
		mv "$contents"/Frameworks/Electron\ Helper\ EH.app/ "$contents"/Frameworks/Sia\ Helper\ EH.app
		mv "$contents"/Frameworks/Sia\ Helper\ EH.app/Contents/MacOS/Electron\ Helper\ EH "$contents"/Frameworks/Sia\ Helper\ EH.app/Contents/MacOS/Sia\ Helper\ EH
		mv "$contents"/Frameworks/Electron\ Helper\ NP.app/ "$contents"/Frameworks/Sia\ Helper\ NP.app
		mv "$contents"/Frameworks/Sia\ Helper\ NP.app/Contents/MacOS/Electron\ Helper\ NP "$contents"/Frameworks/Sia\ Helper\ NP.app/Contents/MacOS/Sia\ Helper\ NP
		mv "$contents"/Frameworks/Electron\ Helper.app/ "$contents"/Frameworks/Sia\ Helper.app
		mv "$contents"/Frameworks/Sia\ Helper.app/Contents/MacOS/Electron\ Helper "$contents"/Frameworks/Sia\ Helper.app/Contents/MacOS/Sia\ Helper
		sed -i.bak s/Electron/Sia/g "$contents"/Info.plist
		sed -i.bak s/Electron/Sia/g "$contents"/Frameworks/Sia\ Helper.app/Contents/Info.plist
		# Create archive
		unzip -quo "$SIA_RELEASE_DIR/"*"$SIA_VERSION"*"$sia_arch.zip" -d "$ui/Sia.app/Contents/Resources/app/Sia"
		mv "$ui/Sia.app/Contents/Resources/app/Sia/"*"$SIA_VERSION"*"$sia_arch"/* "$ui/Sia.app/Contents/Resources/app/Sia/"
		rm -r "$ui/Sia.app/Contents/Resources/app/Sia/"*"$SIA_VERSION"*"$sia_arch"
		zip -FSqr "$ui.zip" "$ui"
	elif [[ $1 == "win64" || $1 == "win32" ]]; then
		mv "$ui/electron.exe" "$ui/Sia.exe"
		rm -rf "$ui/resources/default_app"
		cp -R ../app/ "$ui/resources/app/"
		mkdir -p "$ui/resources/app/Sia"
		# Create archive
		unzip -quo "$SIA_RELEASE_DIR/"*"$SIA_VERSION"*"$sia_arch.zip" -d "$ui/resources/app/Sia"
		zip -FSqr "$ui.zip" "$ui"
	else # linux
		mv "$ui/electron" "$ui/Sia"
		rm -rf "$ui/resources/default_app"
		cp -R ../app/ "$ui/resources/app/"
		mkdir -p "$ui/resources/app/Sia"
		# Create archive
		tar -xzf "$SIA_RELEASE_DIR/"*"$SIA_VERSION"*"$sia_arch.tar.gz" -C "$ui/resources/app/Sia" --strip-components=1
		tar -czf "$ui.tar.gz" "$ui"
	fi
}

# entry point
main() {
	# create the release directory
	mkdir -p "$RELEASE_DIR"
	cd "$RELEASE_DIR"

	# dispatch on argument
	case "$1" in
		linux64|linux32|win64|win32|darwin)
			package "$1"
			;;
		all|"")
			for arch in linux64 linux32 win64 win32 darwin; do
				package "$arch"
			done
			;;
		*)
			echo "Usage: $0 {all|linux64|linux32|win64|win32|darwin}"
	    	exit 1
	esac
}

main "$@"
