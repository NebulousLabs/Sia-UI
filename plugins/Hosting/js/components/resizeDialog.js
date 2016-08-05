import React from 'react'
import { Map } from 'immutable'
import Path from 'path'

const ResizeDialogModal = ({ resizePath, resizeSize, initialSize, actions }) => {
	const handleSettingInput = (e) => actions.updateModal('resizeSize', e.target.value)
	const hideResizeDialog = (newSize) => actions.hideResizeDialog(Map({ path: resizePath, size: newSize }))
	const closeResizeDialog = () => hideResizeDialog(0)
	const handleSubmit = () => {
		if (resizeSize >= 35 && resizeSize !== initialSize.toString()) {
			hideResizeDialog(resizeSize)
		}
	}

	const handleSettingKeyDown = (e) => {
		if (e.keyCode === 13) {
			handleSubmit()
			e.preventDefault()
		}
	}

	return (
		<div className={'hosting-options-modal modal' + (resizePath ? '': ' hidden')}>
			<form className="hosting-options modal-message" onSubmit="">
				<div className="close-button" onClick={closeResizeDialog}>
					X
				</div>

				<h3>Resize &quot;{Path.basename(resizePath)}&quot;</h3>
				<p>
					<label>Size in GB (Min is 35 GB)</label>
					<input type="number" onChange={handleSettingInput} onKeyDown={handleSettingKeyDown} value={resizeSize} min="35" />
				</p>
				<span className={'error' + ( resizeSize < 35 ? '' : ' hidden' )}>Storage folder must be at least 35 GB.</span>
				<p>
					<input className={'button accept' + ( resizeSize !== initialSize.toString() && resizeSize >= 35 ? '' : ' disabled' )} type="button" value="Save" onClick={handleSubmit} />
				</p>
			</form>
		</div>
	)
}

export default ResizeDialogModal
