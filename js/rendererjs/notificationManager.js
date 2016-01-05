'use strict';

const $ = require('jquery');

// Notification system for the UI
var notifications = {};
var lastTimestamp = new Date().getTime();
var inQueue = 0;
var icons = {
	// General
	alert: 'exclamation',
	error: 'exclamation-circle',
	exit: 'exclamation-circle',
	close: 'exclamation-circle',
	update: 'arrow-circle-o-up',
	success: 'check',
	// Wallet
	locked: 'lock',
	unlocked: 'unlock',
	sent: 'send',
	created: 'plus',
	copied: 'clipboard',
	// Progress
	started: 'hourglass-start',
	finished: 'hourglass-end',
	// Hosting
	announced: 'bullhorn',
	saved: 'floppy-o',
	reset: 'refresh',
	// Files
	download: 'arrow-circle-down',
	upload: 'upload',
	siafile: 'file-o',
	asciifile: 'clipboard',
};

// Removes a notification 
function remove(notif) {
	notif.element.slideUp(function() {
		notif.element.remove();
	});
	// Remove from object of presently existing notifications
	notifications[notif.type + notif.message] = undefined;
} 

// Produces a notification element
function show(message, type, clickAction) {
	// Create element for notification
	var icon = icons[type] || icons.alert;
	var element = $('.notification.blueprint').clone().removeClass('blueprint');
	element.find('.icon i').addClass('fa-' + icon);
	element.addClass('type-' + type);
	element.find('.content').text(message);
	element.css({
		opacity: 0
	});
	if (clickAction) {
		element.addClass('hoverable');
		element.click(clickAction);
	}

	// Create object to store notification
	var notif = {
		message: message,
		type: type,
		timeout: setTimeout(function() {
			remove(notif);
		}, 4000),
		element: element,
	};

	// Control the disappearance of notifications
	element.mouseover(function() {
		// don't let the notification disappear if the user is debating
		// clicking
		clearTimeout(notif.timeout);
	});
	element.mouseout(function() {
		// the user isn't interested, restart deletion timer
		notif.timeout = setTimeout(function() {
			remove(notif);
		}, 2500);
	});
	element.animate({
		opacity: 1,
	});

	// Add it to the DOM and array of notifications
	$('.notification-container').prepend(element);
	notifications[type + message] = notif;
}

// Check if repeat notification or too soon after last notification. If
// okay, show notification
function notify(message, type, clickAction) {
	// Check if notification with same type/message is already shown
	var notif = notifications[type + message];
	if (notif) {
		// Don't spam it and instead emphasize it and prolong it
		clearTimeout(notif.timeout);
		notif.timeout = setTimeout(function() {
			remove(notif);
		}, 2500);
		return;
	}

	// TODO: This delay system is technically broken, but not noticably
	// Wait approximately 250ms between notifications
	if (new Date().getTime() < lastTimestamp + 250) {
		inQueue++;
		setTimeout(function() {
			notify(message, type, clickAction);
		}, inQueue * 250);
		return;
	}
	lastTimestamp = new Date().getTime();
	if (inQueue > 0) {
		inQueue--;
	}

	// Show the notification
	show(message, type, clickAction);
}

// Module's only access point is the notify function
module.exports = notify;
