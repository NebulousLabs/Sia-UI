'use strict';

// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 30 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Convert to Siacoin
// TODO: Enable commas for large numbers
function convertSiacoin(hastings) {
	// TODO: JS automatically loses precision when taking numbers from the API.
	// This deals with that imperfectly
	var number = new BigNumber(hastings);
	var ConversionFactor = new BigNumber(10).pow(24);
	return number.dividedBy(ConversionFactor).round(2);
}

// Notification shortcut 
function notify(msg, type) {
	IPCRenderer.sendToHost('notification', msg, type);
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

