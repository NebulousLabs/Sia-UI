// Global variables and require statements
'use strict';

// [PLUGIN] does so and so
UI._Wallet = (function(){

    // [PLUGIN]'s resources
    var cwd = path.join(__dirname, 'plugins', 'Wallet');
    var view = path.join(cwd, 'index.html');

	// init performs startup logic
	function init(){
		console.log(view);
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
