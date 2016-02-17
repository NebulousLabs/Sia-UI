'use strict';

const Electron = require('electron');
const Menu = Electron.Menu;

module.exports = function (window) {
	// Template for Sia-UI tray menu.
	var menutemplate = [
		{
			label: 'Show Sia',
			click: function () { window.restore(); }
		},
		{ type: 'separator' },
		{
			label: 'Hide Sia',
			click: function () { window.minimize(); }
		},
		{ type: 'separator' },
		{
			label: 'Quit Sia',
			click: function() {
				window['wantsQuit'] = true;
				window.close();
			}
		}
	];

	return Menu.buildFromTemplate(menutemplate);
};
