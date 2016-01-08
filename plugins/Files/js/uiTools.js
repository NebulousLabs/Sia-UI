'use strict';

/*
 * uiTools namespace module:
 *   uiTools holds various, useful functions that don't have a place elsewhere
 *   and shouldn't pollute the global namespace. These include communicating
 *   with the general UI, calculations, and formatting numbers
 */

// Node modules
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const BigNumber = require('bignumber.js');

module.exports = {
	// Notification shortcut 
	notify (msg, type) {
		ipcRenderer.sendToHost('notification', msg, type);
	},
	
	// Tooltip shortcut
	tooltip (message, element) {
		var rect = element.getBoundingClientRect();
		ipcRenderer.sendToHost('tooltip', message, {
			top: rect.top,
			bottom: rect.bottom,
			left: rect.left,
			right: rect.right,
			height: rect.height,
			width: rect.width,
			length: rect.length,
		});
	},
	
	// Config shortcut
	config (key, value) {
		value = value || undefined;
		return ipcRenderer.sendSync('config', key);
	},
	
	// Dialog shortcut
	dialog (type, options) {
		return ipcRenderer.sendSync('dialog', type, options);
	},
	
	// Checks whether a path starts with or contains a hidden file or a folder.
	isUnixHiddenPath (path) {
		return (/(^|\/)\.[^\/\.]/g).test(path);
	},
	
	// Format to data size representation with 3 or less digits
	formatByte (bytes) {
		bytes = new BigNumber(bytes);
		if (bytes.isZero()) {
			return '0 B';
		}
		var k = 1000;
		var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
		var number = new BigNumber(bytes).div(Math.pow(k, i)).round(2);
		return number + ' ' + units[i];
	},

	// Calls an async function for each item in an array, calling the callback
	// only after all tasks have finished
	oneFunctionWaterfall (funct, array) {
		var count = array.length;

		// Any amount of optional parameters
		var params = [];
		for (let i = 2; i < arguments.length - 1; i++) {
			let arg = arguments[i];
			params.push(arg);
		}

		// Last parameter should be the callback
		var lastParam = arguments[arguments.length - 1];
		if (typeof lastParam !== 'function') {
			// Ensure this is being used properly
			console.error('No need to waterfall a function without a callback');
			return;
		}
		var callback = lastParam;

		// Callback iff all calls finished
		params.push(function () {
			if (--count === 0 && callback) {
				callback();
			}
		});

		// Called iff empty array, ensures callback is still called
		if (count === 0 && callback) {
			callback();
		}

		// Call funct per array item
		array.forEach(function(item) {
			var specificParams = params.slice(0);
			specificParams.unshift(item);
			funct.apply(null, specificParams);
		});
	},

	// Calls async functions from an array, calling the callback only after all
	// tasks have finished. Second argument, params, is optional. It's an array
	// of parameters to pass into each function.
	multiFunctionWaterfall (functs) {
		var count = functs.length;

		// Any amount of optional parameters
		var params = [];
		for (let i = 2; i < arguments.length - 1; i++) {
			let arg = arguments[i];
			params.push(arg);
		}

		// Last parameter should be the callback
		var lastParam = arguments[arguments.length - 1];
		if (typeof lastParam !== 'function') {
			// Ensure this is being used properly
			console.error('No need to waterfall a function without a callback');
			return;
		}
		var callback = lastParam;

		// Callback iff all calls finished
		params.push(function () {
			if (--count === 0 && callback) {
				callback();
			}
		});

		// Called iff empty funct array, ensures callback is still called
		if (count === 0 && callback) {
			callback();
			return;
		}

    	// Call per function with params (Array or single param allowed)
		functs.forEach(function(funct, index) {
			var specificParams = params.map(param => Array.isArray(param) ? param[index] : param);
			funct.apply(null, specificParams);
		});
	},
	
	// Determines which waterfall behavior is being used
	waterfall(funct) {
		var args = [];
		for (let i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		if (typeof funct === 'function') {
			this.oneFunctionWaterfall.apply(null, args);
		} else if (Array.isArray(funct)) {
			this.multiFunctionWaterfall.apply(null, args);
		} else {
			console.error('Improper use of waterfall function!');
		}
	},
};
