import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import path from 'path'

const ResizeDialogModal = ({ shouldShowResizeDialog, resizePath, resizeSize, actions }) => {
	const handleSettingInput = (e) => actions.updateModal("resizeSize", e.target.value)

	const handleSettingKeyDown = (e) => {
		if (e.keyCode === 13){ hideResizeDialog(resizeSize); e.preventDefault() }
	}

	const hideResizeDialog = (newSize) => actions.hideResizeDialog(Map({ path: resizePath, size: newSize }))

	return (
		<div className={ 'hosting-options-modal modal' + (shouldShowResizeDialog ? '': ' hidden') }>
			<form className="hosting-options modal-message" onSubmit="">
				<div className="close-button" onClick={ hideResizeDialog }>
					X
				</div>

				<h3>Resize &quot;{ path.basename(resizePath) }&quot;</h3>
				<p>
					<label>Size in GB (Min is 35 GB)</label>
					<input type="number" onChange={ handleSettingInput } onKeyDown={ handleSettingKeyDown } value={ resizeSize } min="35"></input>
				</p>

				<p>
					<input className="button" type="button" value="Save" onClick={ function () { hideResizeDialog(resizeSize) } }></input>
				</p>
			</form>
		</div>
	)
}

export default ResizeDialogModal


