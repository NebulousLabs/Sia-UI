To get started, run 'npm install && npm start'

# Technologies

We use three major tools in this application and they follow this hierarchy:
Javascript -> Node/NPM -> Electron.

Javascript should be familiar to most devs. We adhere to [certain style
conventions](http://javascript.crockford.com/code.html)

[Electron](http://electron.atom.io/) is the core set of libararies that power the Atom text editor and is
useful for creating cross-platform desktop applications. 

Making this a desktop application instead of a webapp gives us libraries to
access filepaths and other OS resources (via Node libraries) that a webapp
would be limited from. 

Lastly of note, NPM, or node package manager, gives easy package management.
We use NPM to manage our dependencies (such as Electron) and our development
dependencies (such as JSHint or JSDoc). NPM also handles our command scripting.
To understand this from viewing code and documentation, see the package.json
file and [this npm documentation](https://docs.npmjs.com/misc/scripts)
[A useful guide about using NPM as a build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)


