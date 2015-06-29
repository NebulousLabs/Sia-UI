'use strict';
// Global require statements used across the project. This is mostly to get
// JSHint to stop complaining about these variables being undefined or
// redefined, but it's also a good way to overview what each variable does and
// means
const webFrame = require('web-frame');
const electronScreen = require('screen');
const fs = require('fs');
const path = require('path');
// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.
var UI;
// plugins.js manages all plugin logic on a more back-end level for the UI
var plugins
