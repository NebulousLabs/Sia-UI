import React from 'react'

const UploadButton = ({actions}) => {
	const onUploadClick = () => {
		const filepaths = SiaAPI.openFile({
			title: 'Choose a file to upload',
			properties: ['openFile', 'multiSelections'],
		})
		if (filepaths) {
			actions.showUploadDialog(filepaths)
		}
	}
	const onUploadClickFolder = () => {
		const filepaths = SiaAPI.openFile({
			title: 'Choose a file to upload',
			properties: ['openDirectory'],
		})
		if (filepaths) {
			actions.showUploadDialog(filepaths)
		}
	}
	return (
		<div className="upload-button-container">
			<div onClick={onUploadClick} className="upload-button">
				<i className="fa fa-cloud-upload fa-2x"></i>
				<span>Upload Files</span>
			</div>
			<div onClick={onUploadClickFolder} className="upload-button">
				<i className="fa fa-cloud-upload fa-2x"></i>
				<span>Upload Folder</span>
			</div>
		</div>
	)
}

export default UploadButton
