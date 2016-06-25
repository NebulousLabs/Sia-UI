import React from 'react'

const WarningBarModal = ({ title, message }) => (
	<div className={'warning-bar'}>
		<div className="warning-bar-modal-message">
			<h3>{title}</h3>
			<p>{message}</p>
		</div>
	</div>
)

export default WarningBarModal
