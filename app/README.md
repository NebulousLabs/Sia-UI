# Test UI

This is the user interface for [Sia](https://github.com/NebulousLabs/Sia), it is a desktop application based off the
[electron](https://github.com/atom/electron) framework.

## Prerequisites

- [siad](https://github.com/NebulousLabs/Sia)
    - There are prebuilt binaries [here](https://github.com/NebulousLabs/Sia/releases).
- [node & npm (packaged together)](https://nodejs.org/download/)

## Structure

'index.js' is the entry point which initializes a browser window using
'index.html'. This is the only html file since this app is intended to be a
one-page desktop app.

The 'css' folder contains the app's natively designed css.

The 'js' folder contains the app's js logic.

The 'plugins' folder contains all plugin folders, natively designed or
third-party. Most everything important in the app is a plugin, including
settings. This design allows for community involvemenet and customization to
the maximum extent. Plugins are designed as webpages and are automatically
initialized in the UI's startup by looking for a
./plugins/[PLUGIN_NAME]/index.html file.

Lastly, the 'dependencies' folder is contains all guest content not created for
specifically this UI project (e.g. siad, image logos, third-party css, etc.)

