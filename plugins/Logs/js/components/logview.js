import React, { PropTypes } from 'react'

const logViewStyle = {
	width: '100%',
	height: '80%',
	overflow: 'scroll',
	whiteSpace: 'pre',
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

