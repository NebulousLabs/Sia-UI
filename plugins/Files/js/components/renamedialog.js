import React, { PropTypes } from 'react'

const RenameDialog = ({siapath, actions}) => {
	const onYesClick = (e) => {
		actions.renameFile(siapath, e.target.value)
		actions.hideRenameDialog()
	}
	const onNoClick = () => actions.hideRenameDialog()
	return (
		<div className="modal">
			<div className="rename-dialog">
				<h3> Rename File </h3>
				<div className="rename-text">
					Enter a new name for {siapath}:
				</div>
				<div className="rename-field">
					<input type="text" required autoFocus />
				</div>
				<div className="rename-buttons">
					<button onClick={onYesClick}>Confirm</button>
					<button onClick={onNoClick}>Cancel</button>
				</div>
			</div>
		</div>
	)
}

RenameDialog.propTypes = {
	siapath: PropTypes.string.isRequired,
}

export default RenameDialog
