'use strict';
var Config = require('./js/uiConfig.js');

/**
 * The first renderer process, handles initializing all other managers
 * @class UIManager
 */
function UIManager() {
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

	var notifications = [];
	var lastNotificationTime = 0;
	var notificationsInQueue = 0;
	var notificationIcons = {
		"alert": "exclamation",
		"error": "exclamation",
		"update": "arrow-circle-o-up",
		"upload": "upload",
		"help": "question",
		"sent": "send",
		"received": "sign-in",
		"fix": "wrench",
		"download": "arrow-circle-down",
		"peers": "group",
		"success": "check"
	};
	
	function showNotification(message, type, clickAction, small){
		type = type || "alert";

		var element = $(".notification.blueprint").clone().removeClass("blueprint");
		element.find(".icon i").addClass("fa-" + notificationIcons[type]);
		element.addClass("type-" + type);
		if (small){
			element.addClass("small");
		}
		element.find(".content").text(message);
		element.css({"opacity":0});
		$(".notification-container").prepend(element);
		if (clickAction){
			element.addClass("hoverable");
			element.click(clickAction);
		}

		// Removes the notification element
		function removeElement(){
			element.slideUp(function(){
				element.remove();
			});
		}

		var removeTimeout;
		element.mouseover(function(){
			// don't let the notification disappear if the user is debating
			// clicking
			clearTimeout(removeTimeout)
		});

		element.mouseout(function(){
			// the user isn't interested, restart deletion timer
			removeTimeout = setTimeout(removeElement, 2500);
		})

		element.animate({
			"opacity":1
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
	
	function notify(message, type, clickAction){
		// CONTRIBUTE: This delay system is technically broken, but not noticably
		// wait approximately 250ms between notifications
		if (new Date().getTime() < lastNotificationTime + 250){
			notificationsInQueue ++;

			setTimeout(function(){
				notify(message, type, clickAction);
			}, notificationsInQueue * 250);

			return;
		}

		lastNotificationTime = new Date().getTime();
		if (notificationsInQueue > 0){
			notificationsInQueue --;
		}

		showNotification(message, type, clickAction);
	}

	this.notify = notify;

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
		$("#update-button").click(function(){
			Daemon.update();
		});
	},

	/**
	* Called at window.beforeunload, closes the UI
	* @function UIManager#kill
	*/
   this.kill = function() {
	   Config.save(memConfig, configPath);
   };
}
