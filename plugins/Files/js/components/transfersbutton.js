import React from 'react'

const FileTransfersButton = ({actions}) => {
	const onTransfersClick = () => actions.showFileTransfers()
	return (
		<div className="transfers-button" onClick={onTransfersClick}>
			<i className="fa fa-bars fa-2x"></i>
			<span>File Transfers</span>
		</div>
	)
}

export default FileTransfersButton
