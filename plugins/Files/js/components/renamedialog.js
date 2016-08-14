import React, { PropTypes } from 'react'

const RenameDialog = ({siapath, actions}) => {
	const onYesClick = () => {
		actions.renameFile(siapath, newsiapath)
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
					<input required autoFocus />
				</div>
				<div className="rename-buttons">
					<button onClick={onYesClick}>Yes</button>
					<button onClick={onNoClick}>No</button>
				</div>
			</div>
		</div>
	)
}

RenameDialog.propTypes = {
	siapath: PropTypes.string.isRequired,
	//newsiapath: PropTypes.stringisRequired,
}

export default RenameDialog
