import React, { PropTypes } from 'react'

const redColor = '#E0000B'
const greenColor = '#00CBA0'
const yellowColor = '#E7D414'

const syncStyle = {
	color: redColor,
}

const StatusBar = ({synced, blockheight, peers}) => {
	let status
	if (!synced && peers === 0) {
		syncStyle.color = redColor
		status = 'Not Synchronizing'
	} else if (!synced && peers > 0) {
		syncStyle.color = yellowColor
		status = 'Synchronizing'
	} else if (synced && peers === 0) {
		syncStyle.color = redColor
		status = 'No Peers'
	} else if (synced) {
		syncStyle.color = greenColor
		status = 'Synchronized'
	}
	return (
		<div className="status-bar">
			<div style={syncStyle}>
				<i className="fa fa-globe fa-2x" />
				{status}
			</div>
			<div className="status-bar-blockheight">Block Height: {blockheight}</div>
		</div>
	)
}

StatusBar.propTypes = {
	synced: PropTypes.bool.isRequired,
	blockheight: PropTypes.number.isRequired,
	peers: PropTypes.number.isRequired,
}

export default StatusBar
