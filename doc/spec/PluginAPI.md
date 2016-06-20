# Sia-UI Plugin API Specification

## Introduction

This specification outlines the functionality that Sia-UI's plugin API exposes to developers.

## Functionality

The Sia-UI Plugin api exposes a simple interface for making API calls to siad, creating file dialogs, displaying notifications, and displaying error messages.  This interface is assigned to the `window` object of each plugin, and has the following functions:

- `SiaAPI.call()`, a wrapper to the configured `sia.js`'s `.apiCall` function.
- `SiaAPI.config`, the current Sia-UI config.
- `SiaAPI.hastingsToSiacoins`, conversion function from hastings to siacoins.  Returns a `BigNumber` and takes either a `BigNumber` or `string`.
- `SiaAPI.siacoinsToHastings`, conversion function from siacoins to hastings.
- `SiaAPI.openFile(options)`, a wrapper which calls Electron.dialog.showOpenDialog with `options`.
- `SiaAPI.saveFile(options)`, a wrapper which calls Electron.dialog.showSaveDialog with `options`.
- `SiaAPI.showMessage(options)`, a wrapper which calls Electron.showMessageBox with `options`.
- `SiaAPI.showerror(options)`, a wrapper which calls Electron.showErrorBox with `options`.
