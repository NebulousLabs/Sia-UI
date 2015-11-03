#!/bin/bash

set -o errexit # Exit on error

rm -rf release/Sia-UI-linux-x64/resources/default_app
rm -rf release/Sia-UI-linux-ia32/resources/default_app
rm -rf release/Sia-UI-win32-x64/resources/default_app
rm -rf release/Sia-UI-win32-ia32/resources/default_app
rm -rf release/Sia-UI-darwin-x64/Sia-UI.app/Contents/Resources/default_app
