import React, { PropTypes } from 'react'

const DeleteDialog = ({siapath, actions}) => {
	const onYesClick = () => {
		actions.deleteFile(siapath)
		actions.hideDeleteDialog()
	}
	const onNoClick = () => actions.hideDeleteDialog()
	return (
		<div className="modal">
			<div className="delete-dialog">
				<h3> Confrim Deletion </h3>
				<div className="delete-text">
					Are you sure you want to delete {siapath}?
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
	siapath: PropTypes.string.isRequired,
}

export default DeleteDialog
