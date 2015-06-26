// Global variables and require statements
'use strict';

// pluginManager manages all things to do with plugins for the UI
UI._plugins = (function(){
	// Directory of plugins
	var pluginsDir = path.join(__dirname, 'plugins');
    // DOM element shortcuts
	var head, sideBar, mainView;
	// Default plugin
	var home;

	// init performs startup logic related to plugins
	function init(){
		// Initialize variables upon document completion
		head = document.getElementsByTagName('head')[0];
        sideBar = document.getElementById('sidebar');
		mainView = document.getElementById('view');

		// Initialize UI components that require a read of /app/plugins
		fs.readdir(pluginsDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			// Determine default plugin
			initHome(pluginNames);
			
			// Do tasks per plugin found
			pluginNames.forEach(function(plugin) {
				// Load main.js entry-point into index.html, then initialize
				// the plugin itself. We allow plugins to have their own init()
				// functions while we load their index.html
				loadScript(path.join(pluginsDir, plugin, 'main.js'), function() {
					initPlugin(plugin);
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

	// loadScript adds the plugin main.js code to index.html
	function loadScript(url, callback) {
		// Adding the script tag to the head
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Then bind the event to the callback function. There are two events
		// for cross browser compatibility. onreadystatechange is for IE
		script.onreadystatechange = callback;
		script.onload = callback;

		// Fire the loading
		head.appendChild(script);
	}
	
	// initPlugin loads up the plugin's index.html by default, also calling the
	// plugin's init() function to allow their own custom logic
	function initPlugin(plugin) {
		$.get(path.join(pluginsDir, plugin, 'index.html'), function(data) {
			$('#view').append(data);
		});
		UI['_' + plugin].init();
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
		icon.innerHTML = '<link rel="icon" href=' + iconDir + ' />'
		text.innerText = plugin;

		// Make the button responsive
		btn.addEventListener('click', function () {
			$('#' + plugin + '-view').show();
			UI['_' + plugin].update();
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
