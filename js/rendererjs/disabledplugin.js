import React, { PropTypes } from 'react'

const containerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	backgroundColor: '#C6C6C6',
	width: '100%',
	height: '100%',
}

const DisabledPlugin = ({startSiad}) => (
	<div style={containerStyle}>
		<h1>Siad has stopped.</h1>
		<button onClick={startSiad}>Start Siad</button>
	</div>
)

DisabledPlugin.propTypes = {
	startSiad: PropTypes.func.isRequired,
}

export default DisabledPlugin
