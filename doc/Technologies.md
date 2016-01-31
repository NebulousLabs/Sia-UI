# Technologies

We use three major tools in this application and they follow this hierarchy:
Javascript -> Node/NPM -> Electron. 

### Javascript

This should be familiar to most webdevs. We mostly adhere to [certain style
conventions](http://javascript.crockford.com/code.html)

### [NPM](https://www.npmjs.com/)

Node Package Manager gives easy package management.  We use NPM to manage our
dependencies (such as Electron) and our development dependencies (such as
JSHint or JSDoc). NPM also handles our command scripting. To understand this
and view available npm scripts, see the [package.json](../package.json) file
and [this npm documentation](https://docs.npmjs.com/misc/scripts) on how npm
commands work.

A shortcut explanation of the npm commands you most commonly run from terminal

* `npm install` installs node packages from the npm registry listed under
  `devDependencies` and `dependencies` in the package.json.
* `npm start` runs the app
* `npm test` lints the app with [JSHint](http://jshint.com/about/) and then
  runs some test scripts in the `test` folder
* There's a slew of other custom npm commands under `scripts` in the
  package.json

OPTIONAL: [A useful guide about using NPM as a build
tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)

### [Electron](http://electron.atom.io/)

It's the core set of libararies that power the Atom text editor and is useful
for creating cross-platform desktop applications. 

Making this a desktop application instead of a webapp gives us libraries to
access filepaths and other OS resources (via Node libraries) that a webapp
would be limited from. 

The code does not have to adhere to compatibility for all browsers (looking
at you, Internet Explorer) because electron is run on chromium. This extends
from JS to CSS (with the use of -webkit- rules when applicable).

We do occasionally use ES2015 and ES2016 conventions and syntax in the code
base with no worries for the same reason

