import React, { PropTypes } from 'react'
import fs from 'fs'

const UploadDialog = ({source, path, actions}) => {
	const onUploadClick = () => {
		if (fs.statSync(source).isDirectory()) {
			actions.uploadFolder(path, source)
		} else {
			actions.uploadFile(path, source)
		}
		actions.hideUploadDialog()
	}
	const onCancelClick = () => actions.hideUploadDialog()
	return (
		<div className="modal">
			<div className="upload-dialog">
				<h1> Confirm Upload </h1>
				<div> Would you like to upload {source}?</div>
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
