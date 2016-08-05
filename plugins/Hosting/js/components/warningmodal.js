import React from 'react'

const WarningModalModal = ({ title, message, actions }) => {

	const handleAccept = () => actions.acceptModal()
	const handleDecline = () => actions.declineModal()

	return (
		<div className={'modal'}>
			<div className="modal-message">
				<div className="close-button" onClick={handleDecline}>X</div>
				<h3>{title}</h3>
				<p>{message}</p>
				<p>
					<input className="button accept" type="button" value="Accept" onClick={handleAccept} />
					<br />
					<input className="button cancel" type="button" value="Cancel" onClick={handleDecline} />
				</p>
			</div>
		</div>
	)
}

export default WarningModalModal
