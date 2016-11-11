import React, { PropTypes } from 'react'

const logViewStyle = {
	width: '100%',
	height: '80%',
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

