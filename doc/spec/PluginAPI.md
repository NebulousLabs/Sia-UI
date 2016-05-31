# Sia-UI Plugin API Specification

## Introduction

This specification outlines the functionality that Sia-UI's plugin API exposes to developers.

## Desired Functionality

The plugin API should be simple to use.  It should expose functionality which has been explicitly defined by the main UI.  This functionality should encompass most of what can be done with the Sia API.  State should be contained within the main UI and flow unidirectionally to the plugins.  Plugins will be assigned a `SiaAPI` global when they are created by the main UI.  This `SiaAPI` global includes functions which dispatch actions, such as

* `SiaAPI.getWalletStatus()`
* `SiaAPI.getTransactions()`

`SiaAPI` will expose an `EventEmitter` through which plugins can receive state updates.  Here are some examples of how I envision this API working: 

### Sending (from the main UI, likely in a Saga.  Plugin devs don't need to worry about this)
- `SiaAPI.emit(constants.RECEIVE_BALANCE, '1337 SC')`

### Receiving (this is what plugin developers will use to update their plugin's state):
- `SiaAPI.on(constants.RECEIVE_BALANCE, (balance) => jquery/react/redux/whateverjs.setBalance(balance))`


## Proposed Implementation

- Plugins should stay as iframes.  This gives the loosest coupling, giving any web developer the ability to at least create plugins that will load into the UI statically.  Plugins should be constructed as they are now, as WebViews, and assigned the `SiaAPI` global.  The main UI should be built around handling actions from `SiaAPI` and dispatching state changes through `SiaAPI`, using Redux.

