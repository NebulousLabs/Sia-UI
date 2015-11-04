#!/bin/bash

set -o errexit # Exit on error
readonly UI_VERSION="v0.4.8-beta"

cd "release/$UI_VERSION"

# Array of different distribution strings
declare -a OSes=("linux-x64" "linux-ia32" "win32-x64" "win32-ia32" "darwin-x64")

for OS in "${OSes[@]}"
do
	declare ui="Sia-UI-$OS"

	# Do nothing if the release folder wasn't made
	if ! [ -d "$ui" ]; then
		break
	fi

	# Clean default_app folders
	if [ "$OS" == "darwin-x64" ]; then
		rm -rf $ui/resources/default_app
	else
		rm -rf $ui/Sia-UI.app/Contents/Resources/default_app
	fi

	# Make zip or tarball of folder
	if [ "${OS:0:5}" == "linux" ]; then
		echo "Tarring up $ui"
		tar -czf $ui.tar.gz $ui
	else
		echo "Zipping up $ui"
		zip -FSqr $ui.zip $ui
	fi
done
