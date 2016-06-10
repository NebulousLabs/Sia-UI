import React from 'react'

const UploadButton = ({actions}) => {
	const onUploadClick = () => {
		const filepath = SiaAPI.openFile({
			title: 'Choose a file to upload',
		})[0]
		actions.showUploadDialog(filepath)
	}
	return (
		<div onClick={onUploadClick} className="upload-button">
			<i className="fa fa-cloud-upload fa-2x"></i>
			<span>Upload</span>
		</div>
	)
}

export default UploadButton
