
## Packaging & Releasing Sia-UI

There are some packaging scripts (using electron-packager) in the package.json.

For them to work, you will need to have release archives of the correct version
in the `release` folder of the Sia package in your GOPATH. To do so, run `make
xc` from the Sia repository followed by `npm run release` from the Sia-UI
repository.

## Building Distributables

Places packaged versions into release/ folder, see the package.json for details.

* `npm run release`

## Other Commands

Useful commands for development.

* `npm run clean`
will remove node_modules, your Sia state kept in lib/Sia, and the
configuration settings from config.json.
* `npm run fresh`
will run clean, install, then start to simulate a fresh install run of the UI.
* `npm run debug`
will run the UI with a debug port to aide in inspecting the main process.
* `npm run doc`
will generate documentation about the UI's classes and functions. It's somewhat
messy though.
* `npm run lint`
will output style suggestions for the UI's javascript, including for plugins.

