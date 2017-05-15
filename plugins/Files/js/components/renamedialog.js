import PropTypes from 'prop-types'
import React from 'react'
import Path from 'path'

const RenameDialog = ({file, actions}) => {
	const onYesClick = (e) => {
		e.preventDefault()
		actions.renameFile(file, Path.posix.join(Path.posix.dirname(file.siapath), e.target.newname.value))
	}
	const onNoClick = () => actions.hideRenameDialog()
	return (
		<div className="modal">
			<div className="rename-dialog">
				<div className="rename-text">
					Enter a new name for {Path.basename(file.siapath)}:
				</div>
				<form className="rename-form" onSubmit={onYesClick}>
					<div className="rename-field">
						<input type="text" name="newname" required autoFocus defaultValue={Path.posix.basename(file.siapath)} />
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
	file: PropTypes.object.isRequired,
}

export default RenameDialog
