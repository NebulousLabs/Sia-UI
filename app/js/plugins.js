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
	
	// addButton, called from init on a per-plugin basis, creates the button
	// html to be added and gives it a listener to trigger plugin's update()
	function addButton(plugin) {
		// Reference to the button.ico that the plugin should have
		var iconDir = path.join(pluginsDir, plugin, 'button64.png');
		
		// Make button elements to be combined
		var btn = document.createElement('div');
		var icon = document.createElement('img');
		var text = document.createElement('div');

		// Set inner values
		btn.id = plugin + '-button';
		btn.style.cursor = 'pointer';
		icon.src = iconDir;
		text.innerText = plugin;

		// Make the button show the plugin page on click 
		addClickResponse(btn, plugin);

		// Put it together
		btn.appendChild(icon)
			.className = 'pure-u sidebar-icon';
		btn.appendChild(text)
			.className = 'pure-u sidebar-text';

		// Add it to the sideBar
		sideBar.appendChild(btn)
			.className = 'pure-u-1-1 sidebar-button';
	}

	// addClickResponse gives elements show the corresponding plugin-view
	function addClickResponse(element, plugin) {
		element.addEventListener('click', function () {
			[].slice.call(mainBar.children).forEach(function(view) {
				if (view.id !== plugin + '-view') {
					view.style.display = 'none';
				}
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
				addButton(plugin);
			});
		});
	}

	// Expose elements to be made public
	return {
		'init': init
	};
})();
