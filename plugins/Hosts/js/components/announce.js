import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import path from 'path'

const AnnounceDialogModal = ({ shouldShowAnnounceDialog, announceAddress, actions }) => {
	const handleSettingInput = (e) => actions.updateModal('announceAddress', e.target.value)
	const hideAnnounceDialog = (address) => actions.hideAnnounceDialog(address)
	const handleSettingKeyDown = (e) => { if (e.keyCode === 13) { handleSubmit(); e.preventDefault() } }
	const handleSubmit = () => { if (announceAddress !== ''){ hideAnnounceDialog( announceAddress ) } }

	return (
		<div className={ 'hosting-options-modal modal' + (shouldShowAnnounceDialog ? '': ' hidden') }>
			<form className='hosting-options modal-message' onSubmit=''>
				<div className='close-button' onClick={ function () { hideAnnounceDialog('') } }>
					X
				</div>

				<h3>Announce Host</h3>
				<p>
					<label>Address to announce.</label>
					<input onChange={ handleSettingInput } onKeyDown={ handleSettingKeyDown } value={ announceAddress } type='text'></input>
				</p>
				<span>Click to announce your host to the network. This will cost about 15 SC and only needs to be done once per host.</span>
				<p>
					<input className={ 'button accept' + ( announceAddress !== '' ? '' : ' disabled' ) } type='button' value='Announce' onClick={ handleSubmit }></input>
				</p>
			</form>
		</div>
	)
}

export default AnnounceDialogModal
