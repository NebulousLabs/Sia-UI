'use strict';


// UI.js, the first renderer process, handles loading and transitioning between
// buttons and views. Pretty much all user interaction response should go
// through here.
var UI;

// plugins.js manages all plugin logic on a more back-end level for the UI
var plugins;

// webview.js manages UI logic that relates to electron elements of the
// <webview> HTML tag. They are how buttons and plugin views are displayed and
// require some common intricacies to deal with.
var webview;
