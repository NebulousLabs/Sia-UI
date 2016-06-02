import { Menu } from 'electron'

export default function(window) {
	// Template for Sia-UI tray menu.
	var menutemplate = [
		{
			label: 'Show Sia',
			click: () => window.show(),
		},
		{ type: 'separator' },
		{
			label: 'Hide Sia',
			click: () => window.hide(),
		},
		{ type: 'separator' },
		{
			label: 'Quit Sia',
			click: () => window.destroy(),
		},
	]

	return Menu.buildFromTemplate(menutemplate)
}
