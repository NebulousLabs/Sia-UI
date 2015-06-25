I am only certain about development flow for linux. If you are developing on
another operating system, please expand this documentation.

You will need npm and gconf. Most linux installations will already have gconf.
You should also have tar and zip. To get started, run 'make dependencies && make'.

## DEVTOOL:

grep for the term DEVTOOL: to find switches and console.log commands that
should be commented out upon pull request

## Makefile/NPM-package.json philosophy:
(perhaps this was unnecessary but throw me a bone)
The Makefile provides the most functionality and is the master set of commands.

It uses npm commands where convenient. E.g. using `npm install` in make
dependencies instead of manually getting the node_modules for electron and
other dev tools from their github repos.

NPM makes certain commands more efficient, but should not become overly
complex. E.g. npm scripts will do single jobs and be used here like:
```mf
run: lint
	npm start
lint:
	npm run lint
```
defined in package.json as:
```json
"scripts": {
  "start": "electron app",
  "lint": "jshint app/. --exclude app/libs/",
  "env": "env"
},
```
as opposed to package.json having these commands chain together via:
```json
"scripts": {
  "start": "electron app",
  "prestart": "jshint app/. --exclude app/libs/",
  "env": "env"
},
```
which would have npm start run npm prestart and do two tasks unseen in the
Makefile.

That would be relying too much on the node ecosystem.
