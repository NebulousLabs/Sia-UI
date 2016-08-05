import React from 'react'

const FileTransfersButton = ({actions}) => {
	const onTransfersClick = () => actions.toggleFileTransfers()
	return (
		<div className="transfers-button" onClick={onTransfersClick}>
			<i className="fa fa-bars fa-2x" />
			<span>File Transfers</span>
		</div>
	)
}

export default FileTransfersButton
