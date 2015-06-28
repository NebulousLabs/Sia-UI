// Global variables and require statements
'use strict';

// plugins manages all plugin logic on a more back-end level for the UI
UI._plugins = (function(){
	// Directory of plugins
	var pluginsDir = path.join(__dirname, 'plugins');
    // DOM element shortcuts
	var head, sideBar, mainBar;
	// Default plugin
	var home;

	// init performs startup logic related to plugins
	function init(){

		// Initialize variables upon document completion
		head = document.getElementsByTagName('head')[0];
        sideBar = document.getElementById('sidebar');
		mainBar = document.getElementById('mainbar');

		// Initialize UI components that require a read of /app/plugins
		fs.readdir(pluginsDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			// Determine default plugin
			initHome(pluginNames);
			
			// Do tasks per plugin found
			pluginNames.forEach(function(plugin, index) {

				// Load main.js entry-point into index.html, then initialize
				// the plugin itself.
				loadWebView(mainBar, plugin + '-view', path.join(pluginsDir, plugin, 'index.html'), function(view) {

					// show the home view
					if (index === 0) {
						console.log(index);
						view.style.display = '';
					}
				});

				// Give the plugin a sidebar button
				addButton(plugin);
			});
		});
	}
	
    // initHome detects Overview or otherwise the first plugin, alphabetically,
    // and loads it
    function initHome(pluginNames) {

        // Detect if Overview plugin is installed and set it to be the top
        // button and autoloaded view if so
		var ovIndex = pluginNames.indexOf('Overview');
		if (ovIndex !== -1 && pluginNames[0] !== 'Overview') {
			pluginNames[ovIndex] = pluginNames[0];
			pluginNames[0] = 'Overview';
		}
		home = pluginNames[0];
	}

	// loadWebView adds the webView to the HTML node 'section'
	function loadWebView(section, viewID, url, callback) {

		// Adding the webview tag
		var view = document.createElement('webview');
		view.id = viewID;
		view.src = url;

		// Hide the page to start with and start loading it
		view.style.display = 'none';
		section.appendChild(view);

		// initiate callback and give it a reference to the appended child
		callback(view);
	}
	
	// addButton, called from init on a per-plugin basis, creates the button
	// html to be added and gives it a listener to trigger plugin's update()
	function addButton(plugin) {

		// TODO: icons aren't working
		// Reference to the button.ico that the plugin should have
		var iconDir = path.join(pluginsDir, plugin, 'button.ico');
		
		// Make button elements to be combined
		var btn = document.createElement('div');
		var icon = document.createElement('div');
		var text = document.createElement('div');

		// Set inner values
		btn.id = plugin + '-button';
		btn.style.cursor = 'pointer';
		icon.innerHTML = '<link rel="icon" href=' + iconDir + ' />';
		text.innerText = plugin;

		// Make the button show the plugin page on click 
		btn.addEventListener('click', function () {
			[].slice.call(mainBar.children).forEach(function(view) {
				view.style.display = 'none'
			});
			document.getElementById(plugin + '-view').style.display = '';
		});

		// Put it together
		btn.appendChild(icon)
			.className = 'pure-u sidebar-icon';
		btn.appendChild(text)
			.className = 'pure-u sidebar-text';

		// Add it to the sideBar
		sideBar.appendChild(btn)
			.className = 'pure-u-1-1 sidebar-button';
	}
	
	// Expose elements to be made public
	return {
		'init': init
	};
})();
