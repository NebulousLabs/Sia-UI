'use strict';

// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

// DOM shortcuts
function eID(id) {
	return document.getElementById(id);
}
function toElement(el) {
	if (typeof el === 'string') {
		return eID(el);
	}
	return el;
}
function show(el) {
	toElement(el).classList.remove('hidden');
}
function hide(el) {
	toElement(el).classList.add('hidden');
}
function hidden(el) {
	return toElement(el).classList.contains('hidden');
}

// Get filename from filepath
function nameFromPath(path) {
	return path.replace(/^.*[\\\/]/, '');
}

// Notification shortcut 
function notify(msg, type) {
	IPCRenderer.sendToHost('notify', msg, type);
}

// Ask UI to show tooltip bubble
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

