# Sia-UI Startup Behaviour Specification

## Introduction

This specification outlines the desired behaviour of Sia-UI when it first launches.

## Desired Functionality

### Main Process
- Initialize electron's main window.  Register applicable event listeners (`close`, `closed`, etc), and load the renderer's entrypoint `index.html`. 

### Renderer Process
- Display a loading screen until communication with an active `siad` has been established.
- Disable the loading screen and initialize the plugin system.
