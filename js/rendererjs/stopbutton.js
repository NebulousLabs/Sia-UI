import React, { PropTypes } from 'react'

const StopButton = ({stopSiad}) => (
	<div className="stop-button" onClick={stopSiad}>
		<i className="fa fa-power-off"></i>
		<span>Stop Siad</span>
	</div>
)

StopButton.propTypes = {
	stopSiad: PropTypes.func.isRequired,
}

export default StopButton
