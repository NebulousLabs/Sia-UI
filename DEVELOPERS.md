The top level folder is pertinent mostly for its Makefile which holds the bash
logic to make distributables for each OS through a `make dist` command.

The `app/` folder holds all the code relevant to make test-ui into an npm module
that people could develop with and on.

You will need npm and gconf. Most linux installations will already have gconf.
You should also have tar and zip.

To get started, run 'make'.

TODO:
    - include everything in app/libs/ as node dependencies instead of packing it
    with the app
    - allow for overview, wallet, etc. to all be stand-alone apps in an
    app/plugins/ folder
    - implement autolinting and unit-testing through jshint and mocha
