# [Structure](Structure.md)

We try to keep the root level structure simple while still adhereing to
electron app standards.

The full root level structure is as follows

```diff
 Sia-UI/
 ├── .git/                // Git folder
+├── Sia/                 // Contains siad and wallet files
 ├── assets/              // Font & image files
 ├── css/                 // General CSS
 ├── doc/                 // Documentation like this file
 ├── js/                  // Javascript files
+├── node_modules/        // Node packages get installed to here
 ├── plugins/             // Plugins give the UI its functionality
+├── release/             // Release bundles are placed here
 ├── test/                // Testing scripts ran with mocha
 ├── .finalizeRelease.sh  // Bash script used in `npm run release`
 ├── .gitignore           // Files to ignore for git
 ├── .jsdocrc             // Settings for JSDoc
 ├── .jshintignore        // Files to ignore for JSHint
 ├── .jshintrc            // Settings for JSHint
 ├── .travis.yml          // Settings for Travis CI
 ├── LICENSE              // MIT Open Source License
 ├── README.md            // Readme doc
+├── config.json          // Used to store data between sessions
+├── errors.log           // Records errors presented via the UI's notifications
 ├── index.html           // The first markup page that loads
 ├── index.js             // Entry point of the UI
 └── package.json         // Used with electron and npm
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

