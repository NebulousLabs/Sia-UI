import React, { PropTypes } from 'react'

const StatusBar = ({synced, blockheight}) => (
	<div className="status-bar">
		<div className={synced ? 'status-bar-synced' : 'status-bar-unsynced'}>
			<i className="fa fa-globe fa-2x"></i>
			{synced ? 'Synchronized' : 'Not synchronized'}
		</div>
		<div className="status-bar-blockheight">Block Height: {blockheight}</div>
	</div>
)

StatusBar.propTypes = {
	synced: PropTypes.bool.isRequired,
	blockheight: PropTypes.number.isRequired,
}

export default StatusBar
