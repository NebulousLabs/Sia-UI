import React from 'react'

const DownloadsButton = ({actions}) => {
	const onTransfersClick = () => actions.toggleDownloadList()
	return (
		<div className="downloads-button" onClick={onTransfersClick}>
			<i className="fa fa-bars fa-2x"></i>
			<span>Downloads</span>
		</div>
	)
}

export default DownloadsButton
