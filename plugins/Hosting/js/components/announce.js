import React from 'react'
import Modal from './modal'

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
		<Modal open={announceAddress !== undefined}>
			<div className="hosting-options-modal dialog">
				<form className="hosting-options modal-message" onSubmit="">
					<h3 className="dialog__title">Announce Host</h3>
					<div className="dialog__content">
						<label>Address to announce.</label>
						<div>
							<input
								className="input"
								onChange={handleSettingInput}
								onKeyDown={handleSettingKeyDown}
								value={announceAddress || ''}
								type="text"
							/>
						</div>
						<p>Click to announce your host to the network. This will incur a small transaction fee and only needs to be done once per host.</p>
					</div>
					<div className="dialog__actions">
						<div
							className="close-button button button--danger button--tertiary"
							onClick={closeAnnounceDialog}
						>
							Cancel
						</div>
						<input
							className={'button button--primary accept' + ( announceAddress !== '' ? '' : ' button--disabled' )}
							type="button"
							value="Announce"
							onClick={handleSubmit}
						/>
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default AnnounceDialogModal
