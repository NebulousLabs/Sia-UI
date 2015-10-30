'use strict';

/**
 * The first renderer process, handles initializing all other managers
 * @class UIManager
 */
function UIManager() {
	/**
	 * Config namespace for config management logic
	 * @member {UIConfig} UIManager~Config
	 */
	var Config = require('./js/uiConfig.js');
	/**
	 * Config.json variables
	 * @member {string} UIManager~configPath
	 */
	var configPath = Path.join(__dirname, 'config.json');
	/**
	 * Config variable held in working memory
	 * @member {config} UIManager~memConfig
	 */
	var memConfig;

	// Involved in the notification queue
	var notifications = [];
	var lastNotificationTime = 0;
	var notificationsInQueue = 0;
	var notificationIcons = {
		// General
		alert: 'exclamation',
		error: 'exclamation-circle',
		update: 'arrow-circle-o-up',
		success: 'check',
		// siad
		start: 'play',
		stop: 'stop',
		// Wallet
		locked: 'lock',
		unlocked: 'unlock',
		sent: 'send',
		created: 'plus',
		// Progress
		ongoing: 'hourglass-half',
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

	// Shows tooltip with content on given element
	var eTooltip = $('#tooltip');
	var tooltipTimeout, tooltipVisible;

	function tooltip(element, content, offset) {
		offset = offset || {
			top: 0,
			left: 0,
		};
		element = $(element);

		eTooltip.show();
		eTooltip.html(content);
		var middleX = element.offset().left + element.width()/2;
		var topY = element.offset().top - element.height();

		eTooltip.offset({
			top: topY - eTooltip.height() + offset.top,
			left: middleX - eTooltip.width()/2 + offset.left
		});

		if (!tooltipVisible) {
			eTooltip.stop();
			eTooltip.css({'opacity':0});
			tooltipVisible = true;
			eTooltip.animate({
				'opacity':1
			}, 400);
		} else{
			eTooltip.stop();
			eTooltip.show();
			eTooltip.css({'opacity':1});
		}

		clearTimeout(tooltipTimeout);
		tooltipTimeout = setTimeout(function() {
			// eTooltip.hide();
			eTooltip.animate({
				'opacity':'0'
			},400,function() {
				tooltipVisible = false;
				eTooltip.hide();
			});
		}, 1400);
	}
	
	function showNotification(message, type, clickAction, small) {
		type = type || 'alert';

		var element = $('.notification.blueprint').clone().removeClass('blueprint');
		element.find('.icon i').addClass('fa-' + notificationIcons[type]);
		element.addClass('type-' + type);
		element.find('.content').text(message);
		element.css({'opacity':0});
		$('.notification-container').prepend(element);
		if (clickAction) {
			element.addClass('hoverable');
			element.click(clickAction);
		}

		// Removes the notification element
		function removeElement() {
			element.slideUp(function() {
				element.remove();
			});
		}

		// Control the disappearance of notifications
		var removeTimeout;
		element.mouseover(function() {
			// don't let the notification disappear if the user is debating
			// clicking
			clearTimeout(removeTimeout);
		});
		element.mouseout(function() {
			// the user isn't interested, restart deletion timer
			removeTimeout = setTimeout(removeElement, 2500);
		});
		element.animate({
			'opacity':1
		});
		removeTimeout = setTimeout(removeElement, 4000);
	}

	/**
	 * Shows tooltip with content at given offset location
	 * @function UIManager#tooltip
	 * @param {string} content The message to display in tooltip
	 * @param {Object} offset The dimensions of the element to display over
	 */
	this.tooltip = function(content, offset) {
		offset = offset || {
			top: 0,
			left: 0,
		};
		// Show the tooltip at the proper location
		eTooltip.show();
		eTooltip.html(content);
		var middleX = offset.left - (eTooltip.width()/2) + (offset.width/2);
		var topY = offset.top - (eTooltip.height()) - (offset.height/2);
		eTooltip.offset({
			top: topY,
			left: middleX,
		});
		// Fade the toolip from 0 to 1
		if (!tooltipVisible) {
			eTooltip.stop();
			eTooltip.css({'opacity':0});
			tooltipVisible = true;
			eTooltip.animate({
				'opacity':1
			}, 400);
		} else{
			eTooltip.stop();
			eTooltip.show();
			eTooltip.css({'opacity':1});
		}
		// Hide the tooltip after 1.4 seconds
		clearTimeout(tooltipTimeout);
		tooltipTimeout = setTimeout(function() {
			// eTooltip.hide();
			eTooltip.animate({
				'opacity':'0'
			}, 400, function() {
				tooltipVisible = false;
				eTooltip.hide();
			});
		}, 1400);
	};

	/**
	 * Shows notification in lower right of UI window
	 * @function UIManager#notify
	 * @param {string} message What to display in notification
	 * @param {string} type The form of notification
	 * @param {function} clickAction The function to call upon the user
	 * clicking the notification
	 */
	this.notify = function notify(message, type, clickAction) {
		// TODO: This delay system is technically broken, but not noticably
		// wait approximately 250ms between notifications
		if (new Date().getTime() < lastNotificationTime + 250) {
			notificationsInQueue ++;

			setTimeout(function() {
				notify(message, type, clickAction);
			}, notificationsInQueue * 250);

			return;
		}

		lastNotificationTime = new Date().getTime();
		if (notificationsInQueue > 0) {
			notificationsInQueue --;
		}

		showNotification(message, type, clickAction);
	};

	/**
	* Called at window.onready, initalizes the UI
	* @function UIManager#init
	*/
	this.init = function() {
		Config.load(configPath, function(config) {
			memConfig = config;
			if (memConfig.width && memConfig.height) {
				BrowserWindow.setSize(memConfig.width, memConfig.height);
			}
			if (memConfig.xPosition && memConfig.yPosition) {
				BrowserWindow.setPosition(memConfig.xPosition, memConfig.yPosition);
			}
			Daemon.init(config);
			Plugins.init(config);
		});
		$('#update-button').click(function() {
			Daemon.update();
		});
	};

	/**
	* Called at window.beforeunload, closes the UI
	* @function UIManager#kill
	*/
	this.kill = function(ev) {
		// Save the window's size
		var size = BrowserWindow.getSize();
		memConfig.width = size[0];
		memConfig.height = size[1];
		// Save the window's position
		var pos = BrowserWindow.getPosition();
		memConfig.xPosition = pos[0];
		memConfig.yPosition = pos[1];
		// Save the config
		Config.save(memConfig, configPath);
	};
}
