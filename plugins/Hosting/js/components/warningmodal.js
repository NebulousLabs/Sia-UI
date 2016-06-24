import React from 'react'

const WarningModalModal = ({ title, message, actions }) => {

	return (
		<div className={'modal'}>
			<div className="modal-message">
				<div className="close-button" onClick={actions.declineModal}>X</div>
				<h3>{title}</h3>
				<p>{message}</p>
				<p>
					<input className="button accept" type="button" value="Accept" onClick={actions.acceptModal}></input>
					<br />
					<input className="button cancel" type="button" value="Cancel" onClick={actions.declineModal}></input>
				</p>
			</div>
		</div>
	)
}

export default WarningModalModal
