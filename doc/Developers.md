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

The root level structure is for all dev tool type things. You'll find
node_modules install to here, documentation, and most anything whose file name
starts with a '.'

The app folder contains Sia-UI's functional files.

'index.js' is the entry point which initializes a browser window using
'index.html'. This is the only non-plugin html file since Sia-UI is intended to
be a one-page desktop app.

The 'css' folder contains the app's natively designed css.

The 'js' folder contains the app's js logic.

The 'plugins' folder contains all plugin folders, natively designed or
third-party. Most everything important in the app is a plugin. This design
allows for community involvemenet and customization to the maximum extent.
Plugins are designed as webpages and are automatically initialized in the UI's
startup by looking for a ./plugins/[PLUGIN_NAME]/index.html file.

The 'assets' folder contains all required content not created for specifically
this UI project (e.g. image logos, third-party css, etc.)

Lastly, the 'dependencies' folder contains anything that are not a part of the
project, but that it needs to use. Currently this is only siad.


