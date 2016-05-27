# Sia-UI Plugin API Specification

## Introduction

This specification outlines the functionality that Sia-UI's plugin API exposes to developers.

## Desired Functionality

The plugin API should provide an importable javascript module that provides all of the following features:

- A function which registers a plugin with Sia-UI.
- Access to the running, configured, `sia.js` wrapper.
- Functions to open and save files on the main UI process.

The plugin API should be framework and architecture agnostic.  It should not lock developers into any particular code structure, style, or framework.
