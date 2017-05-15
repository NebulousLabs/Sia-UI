import PropTypes from 'prop-types'
import React from 'react'
import { List } from 'immutable'

const DeleteDialog = ({files, actions}) => {
	const onYesClick = () => {
		files.map(actions.deleteFile)
		actions.hideDeleteDialog()
	}
	const onNoClick = () => actions.hideDeleteDialog()
	return (
		<div className="modal">
			<div className="delete-dialog">
				<h3> Confirm Deletion </h3>
				<div className="delete-text">
					Are you sure you want to delete {files.size} {files.size === 1 ? ' file' : ' files'}
				</div>
				<div className="delete-buttons">
					<button onClick={onYesClick}>Yes</button>
					<button onClick={onNoClick}>No</button>
				</div>
			</div>
		</div>
	)
}

DeleteDialog.propTypes = {
	files: PropTypes.instanceOf(List).isRequired,
}

export default DeleteDialog
