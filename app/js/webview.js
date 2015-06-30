'use strict';
const webFrame = require('web-frame');

// webview.js manages UI logic that relates to electron elements of the
// <webview> HTML tag. They are how buttons and plugin views are displayed and
// require some common intricacies to deal with.
var webview = (function(){
	// load adds the webView to the HTML node 'section'
	function load(section, viewID, url, callback) {
		// Adding the webview tag
		var view = document.createElement('webview');
		view.id = viewID;
		view.src = url;

		// Give webviews nodeintegration
		view.setAttribute('nodeintegration', 'on');

		// Start loading it
		section.appendChild(view);

		// Set the zoom by default to be the same as the UI
		view.addEventListener("did-start-loading", setZoom); 

		// Initiate callback and give it a reference to the appended webview
		callback(view);
	}
	
	// setZoom executes upon each plugin load, ensuring that it displays
	// properly
	function setZoom(event) {
		var zoomCode = 'require("web-frame").setZoomFactor(' + webFrame.getZoomFactor() + ');';
		event.target.executeJavaScript(zoomCode);
	}
	
	// Expose elements to be made public
	return {
		'load': load,
	};
})();

module.exports = webview;
