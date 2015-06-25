// Global variables and require statements
'use strict';

// pluginManager manages all things to do with plugins for the UI
UI._pluginManager = (function(){

	// Directory of plugins
	var pluginDir = path.join(__dirname, 'plugins');

	// init performs startup logic related to plugins
	function init(){

		// Initialize buttons
		// TODO: verify plugin folders
		fs.readdir(pluginDir, function (err, pluginNames) {
			if (err) {
				throw err;
			}

			initHome(pluginNames);
			initButtons(pluginNames);
		});
	}

	// initHome detects Overview or otherwise the first plugin, alphabetically, and loads it
	function initHome(pluginNames) {

		// Detect if Overview plugin is installed and set it to be the 
		// top button and autoloaded view if so
		var ovIndex = $.inArray('Overview', pluginNames);
		if (ovIndex !== 0 && pluginNames[0] !== 'Overview') {
			pluginNames[ovIndex] = pluginNames[0];
			pluginNames[0] = 'Overview';
		}
		
		// Default to Overview or first plugin
		$('#view').load(path.join(pluginDir, pluginNames[0], 'index.html'));
	}

	// initButtons loads sidebar buttons per plugin
	function initButtons(pluginNames) {

		// Populate index.html's sidebar with buttons
		var sideBar = document.getElementById('sidebar');
		for (var i = 0; i < pluginNames.length; i++) {
			var plugin = pluginNames[i];
			var tmpl = document.getElementById('button-template').content.cloneNode(true);

			// TODO: icons aren't working
			var iconDir = path.join(pluginDir, plugin, 'button.ico');
			tmpl.querySelector('.sidebar-icon').innerHTML = '<link rel="icon" href=' + iconDir + ' />';
			tmpl.querySelector('.sidebar-text').innerText = plugin;

			var button = tmpl.querySelector('.sidebar-button');
			button.id = plugin + '-button';
			button.style.cursor = 'pointer';

			// Add the copied, filled out template
			sideBar.appendChild(tmpl);
		}

		// Add click listeners to buttons
		var mainView = $('#view');
		pluginNames.forEach(function(plugin) {
			$("#" + plugin + "-button").click(function() {
				mainView.load(path.join(pluginDir, plugin, 'index.html'));
			});
		});
	}

	// Expose elements to be made public
	return {
		"init": init,
	};

})();
