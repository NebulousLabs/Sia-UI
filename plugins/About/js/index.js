'use strict'

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

