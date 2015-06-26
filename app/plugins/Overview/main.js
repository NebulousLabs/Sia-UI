// Global variables and require statements
'use strict';

// [PLUGIN] does so and so
UI._Overview = (function(){

    // [PLUGIN]'s resources
    var cwd = path.join(__dirname, 'plugins', 'Overview');
    var view = path.join(cwd, 'index.html');


	// init performs startup logic
	function init(){
        $.get(view, function(data){ 
            $('#view').append(data);
        });
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
