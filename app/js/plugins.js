// Global variables and require statements
'use strict';

// pluginManager manages all things to do with plugins for the UI
UI._plugins = (function(){

	// Directory of plugins
	var pluginsDir = path.join(__dirname, 'plugins');
	var head;

	// init performs startup logic related to plugins
	function init(){
		// Initialize variables upon document completion
		head = document.getElementsByTagName('head')[0];

		// Initialize UI components that require a read of /app/plugins
		// TODO: verify plugin folders
		fs.readdir(pluginsDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			initScripts(pluginNames);
			initHome(pluginNames);
			initButtons(pluginNames);
		});
	}


    function initScripts(pluginNames){
        pluginNames.forEach(function(plugin){
			loadScript(path.join(pluginsDir, plugin, 'main.js'), function() {
                UI['_' + plugin].init();
            });
        });
    }

	// loadScript adds the plugin main.js code to index.html
	function loadScript(url, callback)
	{
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
	

	// initHome detects Overview or otherwise the first plugin, alphabetically, and loads it
	function initHome(pluginNames) {

		// Detect if Overview plugin is installed and set it to be the 
		// top button and autoloaded view if so
		var ovIndex = pluginNames.indexOf('Overview');
		if (ovIndex !== -1 && pluginNames[0] !== 'Overview') {
			pluginNames[ovIndex] = pluginNames[0];
			pluginNames[0] = 'Overview';
		}
		
		// Default to Overview or first plugin
        $('#view').load(path.join(pluginsDir, pluginNames[0], 'index.html'));
	}

	// initButtons loads sidebar buttons per plugin
	function initButtons(pluginNames) {

		// Populate index.html's sidebar with buttons
		var sideBar = document.getElementById('sidebar');
		for (var i = 0; i < pluginNames.length; i++) {
			var plugin = pluginNames[i];
			var tmpl = document.getElementById('button-template').content.cloneNode(true);

			// TODO: icons aren't working
			var iconDir = path.join(pluginsDir, plugin, 'button.ico');
			tmpl.querySelector('.sidebar-icon').innerHTML = '<link rel="icon" href=' + iconDir + ' />';
			tmpl.querySelector('.sidebar-text').innerText = plugin;

			var button = tmpl.querySelector('.sidebar-button');
			button.id = plugin + '-button';
			button.style.cursor = 'pointer';

			// Add the copied, filled out template
			sideBar.appendChild(tmpl);
		}

		// Add click listeners to buttons
		pluginNames.forEach(function(plugin) {
			$("#" + plugin + "-button").click(function() {
				$('#view').load(path.join(pluginsDir, plugin, 'index.html'));
			});
		});
	}

	// Expose elements to be made public
	return {
		'init': init
	};
})();
