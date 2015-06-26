// Global variables and require statements
'use strict';

// pluginManager manages all things to do with plugins for the UI
UI._Overview = (function(){

    // This plugin's resources
    var cwd = path.join(__dirname, 'plugins', 'Overview');
    var view = path.join(cwd, 'index.html');


	// init performs plugin startup logic
	function init(){
        //$('#view').load(view);
        $.get(view, function(data){ 
            $("#view").append(data);
        });
        //$('#view').append(view);
	}

	function update(){
        console.log(cwd);
	}

	// Expose elements to be made public
	return {
		'init': init,
		'update': update
	};
})();
