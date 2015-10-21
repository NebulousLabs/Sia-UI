# New Sia UI - 0.4.5-beta

This is the user interface for [Sia](https://github.com/NebulousLabs/Sia), it
is a desktop application based off the
[electron](https://github.com/atom/electron) framework. The ambition behind
this project is to facilitate easy programmatic interaction between users and
the Sia network.

## Prerequisites

- [golang 1.4+](https://golang.org/doc/install) (with a proper GOPATH environment variable)
- [node & npm (packaged together)](https://nodejs.org/download/)

## Running

* `npm install`
* `npm start`

## Building Distributables

Places packaged versions into build/ folder, see the package.json for details.

* `npm run build`

## Cleaning up

**[CAUTION]** Removes node_modules, your Sia state kept in app/dependencies,
and the configuration settings from config.json.

* `npm run clean`

## Other
For other command scripts, look into the package.json file. However here are
some useful ones.

* `npm run fresh`
will run clean, install, then start to simulate a fresh install run of the UI.
* `npm run debug`
will run the UI with a debug port to aide in inspecting the main process.
* `npm run doc`
will generate documentation about the UI's classes and functions. It's somewhat messy though.
* `npm run lint`
will output style suggestions for the UI's javascript, including for plugins.
