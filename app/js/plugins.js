'use strict';

// plugins.js manages all plugin logic on a more back-end level for the UI
plugins = (function(){
	// Plugin specific constants and variables
	// Directory of plugins
	const pluginsDir = path.join(__dirname, 'plugins');
	// DOM element shortcuts
	var sideBar, mainBar;
	// Default plugin
	var home;
	
	function addClickResponse(event) {
		this.addEventListener('click', function () {
			[].slice.call(mainBar.children).forEach(function(view) {
				view.style.display = 'none';
			});
			document.getElementById(plugin + '-view').style.display = '';
		});
	}

	// findHome detects Overview or otherwise the first plugin, alphabetically,
	// and loads it
	function findHome(pluginNames) {
		// Detect if Overview plugin is installed and set it to be the top
		// button and autoloaded view if so
		var ovIndex = pluginNames.indexOf('Overview');
		if (ovIndex !== -1 && pluginNames[0] !== 'Overview') {
			pluginNames[ovIndex] = pluginNames[0];
			pluginNames[0] = 'Overview';
		}
		home = pluginNames[0];
	}

	// init performs startup logic related to plugins
	function init(){
		// Initialize variables upon document completion
		sideBar = document.getElementById('sidebar');
		mainBar = document.getElementById('mainbar');

		// Initialize UI components that require a read of /app/plugins
		fs.readdir(pluginsDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			// Determine default plugin
			findHome(pluginNames);
			
			// Do tasks per plugin found
			pluginNames.forEach(function(plugin, index) {
				// Load plugin index.html's into its own webview, then hide it
				webview.load(mainBar, plugin + '-view', path.join(pluginsDir, plugin, 'index.html'), function(view) {
					// Show only the home view
					if (index !== 0) {
						view.style.display = 'none';
					}
				});

				// Give the plugin a sidebar button
				webview.load(sideBar, plugin + '-button', path.join(pluginsDir, plugin, 'button.html'), function(button) {
					button.className = 'pure-u-1-1 sidebar-button';
					button.addEventListener("did-start-loading", addClickResponse); 
					//button.addEventListener('click', function () {
					//	[].slice.call(mainBar.children).forEach(function(view) {
					//		view.style.display = 'none';
					//	});
					//	document.getElementById(plugin + '-view').style.display = '';
					//});
				});
			});
		});
	}

	// Expose elements to be made public
	return {
		'init': init
	};
})();
