# Test UI

This is the user interface for [Sia](https://github.com/NebulousLabs/Sia), it is a desktop application based off the
[electron](https://github.com/atom/electron) framework.

## Prerequisites

- [golang](https://golang.org/) (with a proper GOPATH environment variable)
- [node & npm (packaged together)](https://nodejs.org/download/)

## Structure

'index.js' is the entry point which initializes a browser window using
'index.html'. This is the only html file since Sia-UI is intended to be a
one-page desktop app.

The 'css' folder contains the app's natively designed css.

The 'js' folder contains the app's js logic.

The 'plugins' folder contains all plugin folders, natively designed or
third-party. Most everything important in the app is a plugin, including
settings. This design allows for community involvemenet and customization to
the maximum extent. Plugins are designed as webpages and are automatically
initialized in the UI's startup by looking for a
./plugins/[PLUGIN_NAME]/index.html file.

The 'assets' folder contains all required content not created for specifically
this UI project (e.g. image logos, third-party css, etc.)

Lastly, the 'dependencies' folder contains anything that are not a part of the
project, but that it needs to use. Currently this is only siad

## Running

1. `npm install`
2. `npm start`

OR

1. `npm run fresh`

## Building Distributables

1. `npm run build`

## Cleaning up

1. `npm run clean`
