import { React } from 'react'
import PasswordPrompt from '../containers/passwordprompt.js'

const ConfirmationDialog = ({actions}) => {
	const onCancelClick = () => actions.hideConfirmationDialog()
	return (
		<div className="confirmation-dialog">
			<PasswordPrompt />
			<button onClick={onCancelClick}>Go Back</button>
		</div>
	)
}

export default ConfirmationDialog
