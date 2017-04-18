import React from 'react'

const AnnounceDialogModal = ({ announceAddress, actions }) => {
	const handleSettingInput = (e) => actions.updateModal('announceAddress', e.target.value)
	const hideAnnounceDialog = (address) => actions.hideAnnounceDialog(address)
	const closeAnnounceDialog = () => hideAnnounceDialog('')
	const handleSubmit = () => {
		if (announceAddress !== '') {
			hideAnnounceDialog( announceAddress )
		}
	}

	const handleSettingKeyDown = (e) => {
		if (e.keyCode === 13) {
			handleSubmit()
			e.preventDefault()
		}
	}

	return (
		<div className={'hosting-options-modal modal' + (announceAddress !== undefined ? '': ' hidden')}>
			<form className="hosting-options modal-message" onSubmit="">
				<div className="close-button" onClick={closeAnnounceDialog}>
					X
				</div>

				<h3>Announce Host</h3>
				<p>
					<label>Address to announce.</label>
					<input onChange={handleSettingInput} onKeyDown={handleSettingKeyDown} value={announceAddress || ''} type="text" />
				</p>
				<span>Click to announce your host to the network. This will incur a small transaction fee and only needs to be done once per host.</span>
				<p>
					<input className={'button accept' + ( announceAddress !== '' ? '' : ' disabled' )} type="button" value="Announce" onClick={handleSubmit} />
				</p>
			</form>
		</div>
	)
}

export default AnnounceDialogModal
