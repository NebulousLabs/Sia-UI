// Template for context menu commands
import { shell, app } from 'electron'
const template = [
	{
		label: 'Edit',
		submenu: [
			{ label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
			{ label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
			{ type:  'separator' },
			{ label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
			{ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
			{ label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
			{ label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
		],
	}, {
		label: 'View',
		submenu: [
			{
				label: 'Reload',
				accelerator: 'CmdOrCtrl+R',
				click: function(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.reload()
					}
				},
			}, {
				label: 'Toggle Full Screen',
				accelerator: (function() {
					if (process.platform ==='darwin') {
						return 'Ctrl+Command+F'
					} else {
						return 'F11'
					}
				})(),
				click: function(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
					}
				},
			}, {
				label: 'Toggle Developer Tools',
				accelerator: (function() {
					if (process.platform ==='darwin') {
						return 'Alt+Command+I'
					} else {
						return 'Ctrl+Shift+I'
					}
				})(),
				click: function(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.webContents.toggleDevTools()
					}
				},
			}, {
				label: 'Toggle Plugin Developer Tools',
				accelerator: (function() {
					if (process.platform ==='darwin') {
						return 'Alt+Command+P'
					} else {
						return 'Ctrl+Shift+P'
					}
				})(),
				click: function(item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.webContents.executeJavaScript('ui.plugins.current.toggleDevTools()')
					}
				},
			},
		],
	}, {
		label: 'Window',
		role: 'window',
		submenu: [
			{ label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
			{ label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' },
		],
	}, {
		label: 'Help',
		role: 'help',
		submenu: [
			{ label: 'Learn More', click: () => shell.openExternal('http://sia.tech/') },
		],
	},
]

if (process.platform ==='darwin') {
	const appName = 'Sia-UI'
	template.unshift({
		label: appName,
		submenu: [
			{ label: 'About ' + appName, role: 'about' },
			{ type:  'separator' },
			{ label: 'Services', role: 'services', submenu: [] },
			{ type:  'separator' },
			{ label: 'Hide ' + appName, accelerator: 'Command+H', role: 'hide' },
			{ label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
			{ label: 'Show All', role: 'unhide' },
			{ type:  'separator' },
			{ label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() },
		],
	})

	// Window menu.
	template[3].submenu.push(
		{ type: 'separator' },
		{ label: 'Bring All to Front', role: 'front' }
	)
}

export default template
