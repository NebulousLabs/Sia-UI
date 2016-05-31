# Sia-UI Plugin API Specification

## Introduction

This specification outlines the functionality that Sia-UI's plugin API exposes to developers.

## Desired Functionality

The plugin API should expose a simple interface for making API calls to siad, creating file dialogs, displaying notifications, and displaying error messages.  This functionality will be wrapped in an object, `SiaAPI`, which is set as a global inside every plugin.  This object will expose an interface to the running, configured, instance of `sia.js` to plugin authors.  It will wrap file dialogs and popup messages with the appropriate IPC calls, so plugin authors do not need to communicate to the main UI directly over ipc.

I envision `SiaAPI` having the following available functions:

- `SiaAPI.call()`, a wrapper to the configured `sia.js`'s `.apiCall` function.
- `SiaAPI.openFile(options)`, a wrapper which calls Electron.dialog.showOpenDialog with `options`.
- `SiaAPI.saveFile(options)`, a wrapper which calls Electron.dialog.showSaveDialog with `options`.
- `SiaAPI.message(options)`, a wrapper which calls Electron.showMessageBox with `options`.
- `SiaAPI.error(options)`, a wrapper which calls Electron.showErrorBox with `options`.

