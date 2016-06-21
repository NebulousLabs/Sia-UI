import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import path from 'path'

const ResizeDialogModal = ({ shouldShowResizeDialog, resizePath, resizeSize, actions }) => {
	const handleSettingInput = (e) => actions.updateModal("resizeSize", e.target.value)
	const hideResizeDialog = (newSize) => actions.hideResizeDialog(Map({ path: resizePath, size: newSize }))
	const handleSettingKeyDown = (e) => { if (e.keyCode === 13) { handleSubmit(); e.preventDefault() } }
    const handleSubmit = () => { if (resizeSize >= 35){ hideResizeDialog(resizeSize); } }

	return (
		<div className={ 'hosting-options-modal modal' + (shouldShowResizeDialog ? '': ' hidden') }>
			<form className="hosting-options modal-message" onSubmit="">
				<div className="close-button" onClick={ function () { hideResizeDialog(0) } }>
					X
				</div>

				<h3>Resize &quot;{ path.basename(resizePath) }&quot;</h3>
				<p>
					<label>Size in GB (Min is 35 GB)</label>
					<input type="number" onChange={ handleSettingInput } onKeyDown={ handleSettingKeyDown } value={ resizeSize } min="35"></input>
				</p>
                <p className={ "error" + ( resizeSize < 35 ? '' : ' hidden' ) }>Storage folder must be at least 35 GB.</p>
				<p>
					<input className="button" type="button" value="Save" onClick={ handleSubmit }></input>
				</p>
			</form>
		</div>
	)
}

export default ResizeDialogModal


