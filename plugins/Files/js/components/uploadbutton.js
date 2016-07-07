import React, { PropTypes } from 'react'

const minimumContracts = 14

const UploadButton = ({contracts = minimumContracts, actions}) => {
	if (contracts < minimumContracts) {
		return (
			<div style={{pointer: 'default', opacity: '0%'}} className="upload-button-container">
				<i className="fa fa-cloud-upload"></i>
				<span>Not Enough Contracts</span>
			</div>
		)
	}
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
				<i className="fa fa-folder-open-o fa-2x"></i>
				<span>Upload Folder</span>
			</div>
		</div>
	)
}

UploadButton.propTypes = {
	contracts: PropTypes.number,
}

export default UploadButton
