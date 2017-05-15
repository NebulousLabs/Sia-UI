import PropTypes from 'prop-types'
import React from 'react'
import fs from 'graceful-fs'

const UploadDialog = ({source, path, actions}) => {
	const onUploadClick = () => {
		source.forEach((file) => {
			if (fs.statSync(file).isDirectory()) {
				actions.uploadFolder(path, file)
			} else {
				actions.uploadFile(path, file)
			}
		})
		actions.hideUploadDialog()
	}
	const onCancelClick = () => actions.hideUploadDialog()
	return (
		<div className="modal">
			<div className="upload-dialog">
				<h1> Confirm Upload </h1>
				<div>Would you like to upload {source.length} {source.length === 1 ? 'item' : 'items'}?</div>
				<div className="upload-dialog-buttons">
					<button onClick={onUploadClick}>Upload</button>
					<button onClick={onCancelClick}>Cancel</button>
				</div>
			</div>
		</div>
	)
}

UploadDialog.propTypes = {
	source: PropTypes.array.isRequired,
	path: PropTypes.string.isRequired,
}

export default UploadDialog
