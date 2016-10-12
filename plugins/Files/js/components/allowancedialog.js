import React, { PropTypes } from 'react'
import UnlockWarning from './unlockwarning.js'

const AllowanceDialog = ({unlocked, allowance, storageEstimate, actions}) => {
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = (e) => {
		e.preventDefault()
		actions.setAllowance(e.target.value)
	}
	const onAllowanceChange = (e) => {
		actions.getStorageEstimate(e.target.value)
	}
	const dialogContents = (
		<div className="allowance-dialog">
			<h3> Buy storage on the Sia Decentralized Network</h3>
			<p>Enter an amount of SC to allocate towards uploading, downloading, and storing data on the Sia network. This amount represents the maximum amount of funds the contractor will spend over a 12 week period. After 12 weeks, the contractor will renew the contracts it forms. Any allocated funds that are not used will be refunded.</p>
			<form className="allowance-form" onSubmit={onAcceptClick}>
				<input type="number" name="allowance" defaultValue={allowance} onChange={onAllowanceChange} required autoFocus className="allowance-amount" />SC
				<div className="allowance-buttons">
					<button type="submit" className="allowance-button-accept">Accept</button>
					<button type="button" onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
				</div>
			</form>
			<span> Estimated storage based on current prices: {storageEstimate} </span>
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
	storageEstimate: PropTypes.string.isRequired,
}

export default AllowanceDialog
