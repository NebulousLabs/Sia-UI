import React from 'react'
import PasswordPrompt from '../containers/passwordprompt.js'

const ConfirmationDialog = ({actions}) => {
	const onCancelClick = () => actions.hideConfirmationDialog()
	return (
		<div className="confirmation-dialog">
			<h3> Please confirm your password to continue </h3>
			<PasswordPrompt />
			<button onClick={onCancelClick}>Go Back</button>
		</div>
	)
}

export default ConfirmationDialog
