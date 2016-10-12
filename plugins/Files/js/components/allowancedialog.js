import React, { PropTypes } from 'react'
import UnlockWarning from './unlockwarning.js'

const AllowanceDialog = ({unlocked, actions}) => {
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = (e) => {
		e.preventDefault()
		actions.setAllowance(e.target.allowance.value)
	}
	const dialogContents = (
		<div className="allowance-dialog">
			<h3> Buy storage on the Sia Decentralized Network</h3>
			<p>Enter an amount of SC to allocate towards uploading, downloading, and storing data on the Sia network.</p>
			<form className="allowance-form" onSubmit={onAcceptClick}>
				<input type="number" name="allowance" required autoFocus className="allowance-amount" />SC
				<div className="allowance-buttons">
					<button type="submit" className="allowance-button-accept">Accept</button>
					<button onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
				</div>
				<p className="allowance-warning">Any unused funds will be refunded.</p>
			</form>
		</div>
	)

	return (
		<div className="modal">
			{unlocked ? dialogContents : <UnlockWarning onClick={onCancelClick} />}
		</div>
	)
}

AllowanceDialog.propTypes = {
	unlocked: PropTypes.bool.isRequired,
	allowance: PropTypes.string.isRequired,
}

export default AllowanceDialog
