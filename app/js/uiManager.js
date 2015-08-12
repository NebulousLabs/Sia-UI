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
		alert: 'exclamation',
		error: 'exclamation-circle',
		update: 'arrow-circle-o-up',
		upload: 'upload',
		sent: 'send',
		start: 'play',
		stop: 'stop',
		download: 'arrow-circle-down',
		success: 'check'
	};

    // Shows tooltip with content on given element
	var eTooltip = $('#tooltip');
    var tooltipTimeout,tooltipVisible;

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

        if (!tooltipVisible){
            eTooltip.stop();
            eTooltip.css({'opacity':0});
            tooltipVisible = true;
            eTooltip.animate({
                'opacity':1
            },400);
        }else{
            eTooltip.stop();
            eTooltip.show();
            eTooltip.css({'opacity':1});
        }

        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(function(){
            // eTooltip.hide();
            eTooltip.animate({
                'opacity':'0'
            },400,function(){
                tooltipVisible = false;
                eTooltip.hide();
            });
        },1400);
    }
	
	function showNotification(message, type, clickAction, small){
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
	 * Makes the app more readable on high dpi screens. 
	 * @function UIManager~adjustHighResZoom
	 * @param {config} config - config in memory
	 * @todo Take better approach, resolution doesn't mean high dpi. Though
	 * supposedly there's not a sure-fire way to find dpi on all platforms.
	 */
	function adjustHighResZoom(config) {
		// Calculated upon function call to get appropriate zoom (even if the
		// primary display were to change).
		var screenSize = ElectronScreen.getPrimaryDisplay().workAreaSize;
		var screenArea = screenSize.width * screenSize.height;
		if (screenArea >= 2048*1152) {
			config.zoom = 2;
			WebFrame.setZoomFactor(config.zoom);
		}
	}
	
	/**
	 * Shows tooltip with content on given element
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
		}else{
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
	 * @param {string} message What to display in notification
	 * @param {string} type The form of notification
	 * @param {function} clickAction The function to call upon the user
	 * clicking the notification
	 */
	this.notify = function notify(message, type, clickAction) {
		// CONTRIBUTE: This delay system is technically broken, but not
		// noticably wait approximately 250ms between notifications
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
			Daemon.init(config);
			//adjustHighResZoom(config);
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
   this.kill = function() {
	   Config.save(memConfig, configPath);
   };
}
