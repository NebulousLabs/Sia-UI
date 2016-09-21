import { Menu } from 'electron'

export default function(window) {
	// Template for Sia-UI tray menu.
	const menutemplate = [
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
			click: () => {
				window.webContents.send('quit')
			},
		},
	]

	return Menu.buildFromTemplate(menutemplate)
}
