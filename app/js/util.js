// Global variables and require statements
'use strict';

// util handles math and commonly used functions that other processes use
var util = (function() {
	// log is used by setLogScaleZoom
	function log(base, number) {
		return Math.log(number) / Math.log(base);
	}

	// Expose elements to be made public
	return {
		'log': log,
	};

})();
