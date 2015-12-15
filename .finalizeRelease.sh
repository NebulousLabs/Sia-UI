#!/bin/bash

set -o errexit # Exit on error
readonly VERSION="v0.4.8-beta"
declare -a Electron_Archs=("linux-x64" "linux-ia32" "win32-x64" "win32-ia32" "darwin-x64")
declare -a Sia_Archs=("linux-amd64" "linux-386" "windows-amd64" "windows-386" "darwin-amd64")

cd "release/$VERSION"

# generic packaging function
package() {
	local electron_arch="$1"
	local ui="Sia-UI-$electron_arch"
	local extension=".zip"
	if [ "${1:0:5}" == "linux" ]; then
		extension=".tar.gz"
	fi

	local sia_arch=""
	for i in "${!Electron_Archs[@]}"; do
	   if [[ "${Electron_Archs[$i]}" = "${1}" ]]; then
	       sia_arch="${Sia_Archs[$i]}";
	   fi
	done
	local sia_folder="Sia-${VERSION}-${sia_arch}"
	local sia_archive="${sia_folder}${extension}"
	local sia_url="https://github.com/NebulousLabs/Sia/releases/download/${VERSION}/${sia_archive}"

	# Download Sia release
	wget -q $sia_url

	# Import siad, remove default_app folder, archive release
	if [ "$electron_arch" == "darwin-x64" ]; then
		local resources="$ui/Sia-UI.app/Contents/Resources"
		rm -rf "$resources/default_app"

		# Extract and rename Sia release
		unzip -quo "$sia_archive" -d "$resources/app"
		mv "$resources/app/$sia_folder" "$resources/app/Sia"

		# Create archive
		echo "Zipping up $ui"
		zip -FSqr $ui$extension $ui
	elif [[ $electron_arch == "win32-x64" || $electron_arch == "win32-ia32" ]]; then
		rm -rf "$ui/resources/default_app"

		# Extract and rename Sia release
		unzip -quo "$sia_archive" -d "$ui/resources/app"
		mv "$ui/resources/app/$sia_folder" "$ui/resources/app/Sia"

		# Create archive
		echo "Zipping up $ui"
		zip -FSqr $ui$extension $ui
	else # linux
		rm -rf "$ui/resources/default_app"

		# Extract and rename Sia release
		tar -xzf "$sia_archive" -C "$ui/resources/app"
		mv "$ui/resources/app/$sia_folder" "$ui/resources/app/Sia"

		# Create archive
		echo "Tarring up $ui"
		tar -czf $ui$extension $ui
	fi

	# Delete Sia archive once put in the UI
	rm -f $sia_archive
}

# dispatch on argument
case "$1" in
	linux-x64|linux-ia32|win32-x64|win32-ia32|darwin-x64)
		package "$1"
		;;
	all|"")
		for arch in "${Electron_Archs[@]}"; do
			package "$arch"
		done
		;;
	*)
		echo "Usage: $0 {all|$Electron_Archs}"
    	exit 1
esac

