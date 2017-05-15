import PropTypes from 'prop-types'
import React from 'react'
import { shell } from 'electron'

const containerStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	backgroundColor: '#C6C6C6',
	width: '100%',
	height: '100%',
}

const errorLogStyle = {
	height: '300px',
	width: '80%',
	overflow: 'auto',
	marginBottom: '15px',
}

const reportStyle = {
	color: 'blue',
	cursor: 'pointer',
}

const handleReport = () => {
	shell.openExternal('https://github.com/NebulousLabs/Sia/issues')
}


const DisabledPlugin = ({errorMsg, startSiad}) => (
	<div style={containerStyle}>
		<h2>Siad has exited unexpectedly. Please submit a bug report including the error log <a style={reportStyle} onClick={handleReport}>here.</a></h2>
		<h2> Error Log: </h2>
		<textarea style={errorLogStyle} readOnly>
			{errorMsg}
		</textarea>
		<button onClick={startSiad}>Start Siad</button>
	</div>
)

DisabledPlugin.propTypes = {
	errorMsg: PropTypes.string.isRequired,
	startSiad: PropTypes.func.isRequired,
}

export default DisabledPlugin
