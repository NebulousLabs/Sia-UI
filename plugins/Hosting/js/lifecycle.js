'use strict';

// Manges the lifecycle of the plugin
function lifecycle() {
	// Tracks if the view is shown
	var updating;
	var refreshRate = 15000;

	// Notification shortcut 
	function notify(msg, type) {
		IPCRenderer.sendToHost('notify', msg, type);
	}

	// Get host status regularly
	function update() {
		Siad.apiCall('/host', function(result) {
			Host.update(result);
		});
		updating = setTimeout(update, refreshRate);
	}

	// Called upon transitioning away from this view
	function stop() {
		clearTimeout(updating);
	}
	
	// Ask UI to show tooltip bubble above element
	function tooltip(message, element) {
		var rect = element.getBoundingClientRect();
		IPCRenderer.sendToHost('tooltip', message, {
			top: rect.top,
			bottom: rect.bottom,
			left: rect.left,
			right: rect.right,
			height: rect.height,
			width: rect.width,
			length: rect.length,
		});
	}
	
	// Expose public members
	return {
		update: update,
		stop: stop,
		notify: notify,
		tooltip: tooltip,
	};
}

// requiring this file gives an instance of the above class
module.exports = lifecycle();

