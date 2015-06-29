'use strict';

// webview.js manages UI logic that relates to electron elements of the
// <webview> HTML tag. They are how buttons and plugin views are displayed and
// require some common intricacies to deal with.
webview = (function(){
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

		// Initiate callback and give it a reference to the appended webview
		callback(view);
	}
	
	// loadStarted executes upon each plugin load, ensuring that it displays
	// properly
	function loadStarted(event) {
		event.target.executeJavaScript('require("web-frame").setZoomFactor(' + webFrame.getZoomFactor() + ');');
	}
	
	// Expose elements to be made public
	return {
		'load': load,
		'loadStarted': loadStarted
	};
})();
