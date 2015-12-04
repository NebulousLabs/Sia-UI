'use strict';

/**
 * The first renderer process, handles initializing all other managers
 * @class UIManager
 */
module.exports = (function UIManager() {
	// Namespace for config management logic
	var settings = require('./uiConfig');
	// Config.json variables
	var configPath = Path.join(__dirname, '..', 'config.json');
	// Config variable held in working memory
	var memConfig;
	// Variable to track error log
	var errorLog;

	// Involved in the notification queue
	var notifications = [];
	var lastNotificationTime = 0;
	var notificationTimeout;
	var notificationsInQueue = 0;
	var notificationIcons = {
		// General
		alert: 'exclamation',
		error: 'exclamation-circle',
		update: 'arrow-circle-o-up',
		success: 'check',
		// siad
		loading: 'spinner fa-pulse',
		stop: 'stop',
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

	// Shows tooltip with content on given element
	var eTooltip = $('#tooltip');
	var tooltipTimeout, tooltipVisible;

	// Removes a notification element
	function removeNotification(el) {
		el.slideUp(function() {
			el.remove();
		});
	} 

	// Produces a notification element
	function showNotification(message, type, clickAction) {
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

		// Control the disappearance of notifications
		element.mouseover(function() {
			// don't let the notification disappear if the user is debating
			// clicking
			clearTimeout(notificationTimeout);
		});
		element.mouseout(function() {
			// the user isn't interested, restart deletion timer
			notificationTimeout = setTimeout(function() {
				removeNotification(element);
			}, 2500);
		});
		element.animate({
			'opacity':1,
		});
		notificationTimeout = setTimeout(function() {
			removeNotification(element);
		}, 4000);
	}

	/**
	 * Shows tooltip with content at given offset location
	 * @function UIManager#tooltip
	 * @param {string} content The message to display in tooltip
	 * @param {Object} offset The dimensions of the element to display over
	 */
	function tooltip(content, offset) {
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
	}

	/**
	 * Shows notification in lower right of UI window
	 * @function UIManager#notify
	 * @param {string} message What to display in notification
	 * @param {string} type The form of notification
	 * @param {function} clickAction The function to call upon the user
	 * clicking the notification
	 */
	function notify(message, type, clickAction) {
		// Record errors for reference
		if (type === 'error') {
			if (!errorLog) {
				errorLog = Fs.createWriteStream(Path.join(__dirname, '..', 'errors.log'));
			}
			try {
				errorLog.write(message + '\n');
			} catch (e) {
				errorLog.write(e.toString() + '\n');
			}
		}

		// TODO: This delay system is technically broken, but not noticably
		// wait approximately 250ms between notifications
		if (new Date().getTime() < lastNotificationTime + 250) {
			notificationsInQueue++;

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
	}

	/**
	 * Refreshes notification of a certain type
	 * @function UIManager#renotify
	 * @param {string} type The form of notification
	 * TODO: Imperfect way to find notification
	 */
	function renotify(type) {
		var notif = $('.type-' + type).first();
		clearTimeout(notificationTimeout);
		notificationTimeout = setTimeout(function() {
			removeNotification(notif);
		}, 2500);
	}

	// Checks if there is an update available
	function checkUpdate() {
		$.ajax({
			url: 'https://api.github.com/repos/NebulousLabs/Sia-UI/releases',
			type: 'GET',
			success: function(responseData, textStatus, jqXHR) {
				// If version matches latest release version, do nothing
				if (responseData[0].tag_name === require('../package.json').version) {
					return;
				}

				// If not, provide links to UI release page
				var updatePage = function() {
					Shell.openExternal('https://github.com/NebulousLabs/Sia-UI/releases');
				};
				$('#update-ui').show().click(updatePage);
				notify('Update available for UI', 'update', updatePage);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// jqXHR is the XmlHttpRequest that jquery returns back on error
				var errCode = textStatus + ' ' + jqXHR.status + ' ' + errorThrown + ' ' + jqXHR.responseText;
				notify('Update check failed: ' + errCode, 'error');
			},
		});
	}

	/**
	* Called at window.onready, initalizes the UI
	* @function UIManager#init
	*/
	function init() {
		checkUpdate();
		settings.load(configPath, function(config) {
			memConfig = config;

			// Load the window's size and position
			mainWindow.setBounds(memConfig);

			// Init other manager classes
			Daemon.init(config);
			Plugins.init(config);
		});
	}

	/**
	* Called at window.beforeunload, closes the UI
	* @function UIManager#kill
	*/
	function kill(ev) {
		// Close the error write stream
		if (errorLog) {
			errorLog.end();
		}

		// Save the window's size and position
		var bounds = mainWindow.getBounds();
		for (var k in bounds) {
			if (bounds.hasOwnProperty(k)) {
				memConfig[k] = bounds[k];
			}
		}

		// Save the config
		settings.save(memConfig, configPath);
	}

	/**
	* Get or set a config key
	* @function UIManager#config
	*/
	function config(args) {
		if (args.value !== undefined) {
			memConfig[args.key] = args.value;
		}
		return memConfig[args.key];
	}

	return {
		init: init,
		kill: kill,
		tooltip: tooltip,
		notify: notify,
		renotify: renotify,
		config: config,
	};
})();
