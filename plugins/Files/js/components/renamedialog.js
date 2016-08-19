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
				<form onSubmit={onYesClick}>
					<div className="rename-field">
						<input type="text" required autoFocus defaultValue={siapath} />
					</div>
					<div className="rename-buttons">
						<button type="submit">Confirm</button>
						<button type="button" onClick={onNoClick}>Cancel</button>
					</div>
				</form>
			</div>
		</div>
	)
}

RenameDialog.propTypes = {
	siapath: PropTypes.string.isRequired,
}

export default RenameDialog
