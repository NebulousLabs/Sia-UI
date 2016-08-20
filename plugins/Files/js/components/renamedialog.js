import React, { PropTypes } from 'react'
import Path from 'path'

const RenameDialog = ({siapath, actions}) => {
	const onYesClick = (e) => {
		e.preventDefault()
		actions.renameFile(siapath, Path.join(Path.dirname(siapath), e.target.newsiapath.value))
	}
	const onNoClick = () => actions.hideRenameDialog()
	return (
		<div className="modal">
			<div className="rename-dialog">
				<div className="rename-text">
					Enter a new name for {Path.basename(siapath)}:
				</div>
				<form className="rename-form" onSubmit={onYesClick}>
					<div className="rename-field">
						<input type="text" name="newsiapath" required autoFocus defaultValue={Path.basename(siapath)} />
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
