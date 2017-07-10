'use strict'
const os = require('os')
const util = require('util')

// Set UI version via package.json.
document.getElementById('uiversion').innerHTML = VERSION

// Set daemon version via API call.
SiaAPI.call('/daemon/version', (err, result) => {
	if (err) {
		SiaAPI.showError('Error', err.toString())
		ipcRenderer.sendToHost('notification', err.toString(), 'error')
	} else {
		document.getElementById('siaversion').innerHTML = result.version
	}
})

function genDownloadLink(version, platform) {
	let plat = platform
	if (plat === 'darwin') {
		plat = 'osx'
	}

	return util.format('https://github.com/NebulousLabs/Sia-UI/releases/download/v%s/Sia-UI-v%s-%s-x64.zip', version, version, plat)
}

function updateCheck() {
	SiaAPI.call('/daemon/update', (err, result) => {
		if (err) {
			SiaAPI.showError('Error', err.toString())
			ipcRenderer.sendToHost('notification', err.toString(), 'error')
		} else if (result.available) {
			document.getElementById('newversion').innerHTML = result.version
			document.getElementById('downloadlink').href = genDownloadLink(result.version, os.platform())
			document.getElementById('nonew').style.display = 'none'
			document.getElementById('yesnew').style.display = 'block'
		} else {
			document.getElementById('nonew').style.display = 'block'
			document.getElementById('yesnew').style.display = 'none'
		}
	})
}

document.getElementById('updatecheck').onclick = updateCheck
