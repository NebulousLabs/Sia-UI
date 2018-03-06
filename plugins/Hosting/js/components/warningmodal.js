import React from 'react'
import Modal from './modal'

const WarningModalModal = ({ open, title, message, actions, renderActions }) => {

	const handleAccept = () => actions.acceptModal()
	const handleDecline = () => actions.declineModal()

	return (
		<Modal open={open}>
			<div className="modal-message dialog">
				<h3 className="dialog__title">{title}</h3>
				<div className="dialog__content">{message}</div>
				<div className="dialog__actions">
					{
						renderActions
							? renderActions({ handleAccept, handleDecline })
							: (
								<React.Fragment>
									<input
										className="button button--danger button--tertiary cancel"
										type="button"
										value="Cancel"
										onClick={handleDecline}
									/>
									<input
										className="button button--primary accept"
										type="button"
										value="Accept"
										onClick={handleAccept}
									/>
								</React.Fragment>
							)
					}
				</div>
			</div>
		</Modal>
	)
}

export default WarningModalModal
