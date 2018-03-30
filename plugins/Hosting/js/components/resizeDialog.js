import React from 'react'
import { Map } from 'immutable'
import Path from 'path'
import Modal from './modal'

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
		<Modal open={resizePath}>
			<div className="hosting-options-modal dialog">
				<form className="hosting-options modal-message" onSubmit="">
					<h3 className="dialog__title">Resize &quot;{Path.basename(resizePath)}&quot;</h3>
					<div className="dialog__content">
						<label>Size in GB (Min is 35 GB)</label>
						<div>
							<input className="input" type="number" onChange={handleSettingInput} onKeyDown={handleSettingKeyDown} value={resizeSize} min="35" />
						</div>
						<div className={'error' + ( resizeSize < 35 ? '' : ' hidden' )}>Storage folder must be at least 35 GB.</div>
					</div>
					<div className="dialog__actions">
						<div className="close-button button button--danger button--tertiary" onClick={closeResizeDialog}>
							Cancel
						</div>
						<input className={'button button--primary accept' + ( resizeSize !== initialSize.toString() && resizeSize >= 35 ? '' : ' disabled' )} type="button" value="Save" onClick={handleSubmit} />
					</div>
				</form>
			</div>
		</Modal>
	)
}

export default ResizeDialogModal
