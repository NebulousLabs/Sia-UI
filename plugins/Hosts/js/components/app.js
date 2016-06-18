import React from 'react'
import Header from '../containers/header.js'
import Body from '../containers/body.js'
import EditModal from '../containers/edit.js'
import ResizeDialog from '../containers/resizeDialog.js'

const HostingApp = () => (
	<div className="app">
		<Header />
		<Body />
		<EditModal />
		<ResizeDialog />
	</div>
)

export default HostingApp
