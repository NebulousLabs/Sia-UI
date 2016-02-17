'use strict';

const Electron = require('electron');
const Menu = Electron.Menu;

module.exports = function (window) {
	// Template for Sia-UI tray menu.
	var menutemplate = [
		{
			label: 'Show Sia',
			click: function () { window.show(); }
		},
		{ type: 'separator' },
		{
			label: 'Hide Sia',
			click: function () { window.hide(); }
		},
	];

	return Menu.buildFromTemplate(menutemplate);
};

