import PropTypes from 'prop-types'
import React from 'react'

const FileTransfersButton = ({unread, actions}) => {
	const onTransfersClick = () => actions.toggleFileTransfers()
	return (
		<div className="transfers-button" onClick={onTransfersClick}>
			<i className="fa fa-bars fa-2x" />
			{unread > 0 ? (
				<span className="badge" key={unread}>{unread > 10 ? '10+' : unread}</span>
				) : null}
			<span>File Transfers</span>
		</div>
	)
}

FileTransfersButton.propTypes = {
	unread: PropTypes.number.isRequired,
}

export default FileTransfersButton
