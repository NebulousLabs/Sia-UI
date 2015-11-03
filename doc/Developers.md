To get started, ensure you have proper golang, node, and npm environments.
After that, starting the application is as easy as running:

`npm install && npm start`

## Technologies

We use three major tools in this application and they follow this hierarchy:
Javascript -> Node/NPM -> Electron. Firstly, one needs to have a golang
environment that can `go get` our Sia repo and build. 

### Golang

For help with installing golang, look to [the official doc directions](https://golang.org/doc/install).
Otherwise one can always [install go from source](https://golang.org/doc/install/source). Lastly, we're very active on
our [Slack channel](http://siatalk-slackin.herokuapp.com/) and have probably ran into your issue before!

### Javascript

This should be familiar to most devs. We mostly adhere to [certain style
conventions](http://javascript.crockford.com/code.html)

### [NPM](https://www.npmjs.com/)

Node Package Manager gives easy package management.  We use NPM to manage our
dependencies (such as Electron) and our development dependencies (such as
JSHint or JSDoc). NPM also handles our command scripting.  To understand this
from viewing code and documentation, see the package.json file and [this npm
documentation](https://docs.npmjs.com/misc/scripts)

OPTIONAL: [A useful guide about using NPM as a build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)

### [Electron](http://electron.atom.io/)

It's the core set of libararies that power the Atom text editor and is
useful for creating cross-platform desktop applications. 

Making this a desktop application instead of a webapp gives us libraries to
access filepaths and other OS resources (via Node libraries) that a webapp
would be limited from. 

## Structure

We try to keep the root level structure as simple as possible while still
adhereing to electron app standards.

The basic root level structure is as follows: 
```diff
 Sia-UI/
+├── .git/            // Git 
+├── Sia/             // Contains siad and wallet files
 ├── assets/          // Font & image files
 ├── css/             // General CSS
 ├── doc/             // Documentation like this file
 ├── js/              // General Javascript
+├── node_modules/    // Node packages get installed to here
 ├── plugins/         // Plugins give the UI its functionality
+├── release/         // Release archives are placed here
 ├── LICENSE          // MIT Open Source License
 ├── README.md        // Readme doc
+├── config.json      // Used to store data between sessions
 ├── index.html       // The first markup page that loads
 ├── index.js         // Entry point of the UI
 └── package.json     // Used with electron and npm
```
Note: '+' marked lines are generated and aren't inherent to the repository

The 'assets' folder contains all required content not created for specifically
this UI project (e.g. image logos, fonts, etc.)

The 'plugins' folder contains all plugin folders, natively designed or
third-party. Most everything important in the ui is a plugin. This design
allows for community involvemenet and customization to the maximum extent.
Plugins are designed as webpages and are automatically initialized in the UI's
startup by looking for a ./plugins/[PLUGIN_NAME]/index.html file.

'config.json' is a json created upon a user first opening the UI and tracks
things like window position, siad's hosted address, etc.

'index.js' initializes a browser window using 'index.html'. This is the only
non-plugin html file since Sia-UI is intended to be a one-page desktop app.

'package.json' contains most of the CLI commands we use to interact with the UI
and is an overall core tool to how npm and electron function. This should be
carefully examined.

## Packaging & Releasing Sia-UI

There are some packaging scripts (using electron-packager) in the package.json.

For them to work, you will need to have release archives of the correct version
in the `release` folder of the Sia package in your GOPATH. To do so, run `make
xc` from the Sia repository followed by `npm run release` from the Sia-UI
repository.

