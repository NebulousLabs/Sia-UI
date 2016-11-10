import React from 'react'
import FilterControls from '../containers/filtercontrols.js'
import LogView from '../containers/logview.js'

const appStyle = {
	position: 'absolute',
	top: '0',
	bottom: '0',
	left: '0',
	right: '0',
}

const App = () => (
	<div style={appStyle}>
		<LogView />
		<FilterControls />
	</div>
)

export default App

