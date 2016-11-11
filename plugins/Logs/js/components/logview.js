import React, { PropTypes } from 'react'

const logViewStyle = {
	position: 'absolute',
	top: '60px',
	bottom: '50px',
	left: '2px',
	right: '0',
	margin: '0',
	padding: '0',
	overflowY: 'scroll',
	whiteSpace: 'pre',
	fontSize: '12px',
	fontFamily: 'monospace',
}

const LogView = ({logText}) => (
	<div style={logViewStyle}>
		{logText}
	</div>
)

LogView.propTypes = {
	logText: PropTypes.string.isRequired,
}

export default LogView

