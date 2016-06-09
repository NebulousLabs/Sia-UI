import React, { PropTypes } from 'react'

const UploadDialog = ({source, path, actions}) => {
	const onUploadClick = () => actions.uploadFile(source, path)
	const onCancelClick = () => actions.hideUploadDialog()
	return (
		<div className="modal">
			<div className="upload-dialog">
				<h1> Upload </h1>
				<span> Would you like to upload {source}?</span>
				<div className="upload-dialog-buttons">
					<button onClick={onUploadClick}>Upload</button>
					<button onClick={onCancelClick}>Cancel</button>
				</div>
			</div>
		</div>
	)
}

UploadDialog.propTypes = {
	source: PropTypes.string.isRequired,
	path: PropTypes.string.isRequired,
}

export default UploadDialog
