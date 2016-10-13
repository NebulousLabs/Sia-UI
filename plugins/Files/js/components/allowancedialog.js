import React, { PropTypes } from 'react'
import UnlockWarning from './unlockwarning.js'

const AllowanceDialog = ({unlocked, feeEstimate, storageEstimate, actions}) => {
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = (e) => {
		e.preventDefault()
		actions.setAllowance(e.target.allowance.value)
	}
	const onAllowanceChange = (e) => {
		actions.getStorageEstimate(e.target.value)
		actions.setFeeEstimate(Math.floor(1000 + 0.12 * parseInt(e.target.value)) || 0)
	}
	const dialogContents = (
		<div className="allowance-dialog">
			<h3> Buy storage on the Sia Decentralized Network</h3>
			<p> Before you can upload to Sia, you have to form contracts with the hosts. This sets aside some money into a pool for you to spend on storage, uploading, and downloading. Funds will stay in the pool for 12 weeks. Funds not spent after 12 weeks will be returned to your wallet. Fees will not be returned. </p>
			<p> The pool will refill automatically every 6 weeks, using the full 3 month budget. You will pay the fees again. Your computer must be online to refill the allowance, and if the allowance is unable to refill before the pool expires, you will lose all of your data.</p>
			<form className="allowance-form" onSubmit={onAcceptClick}>
				<input type="number" name="allowance" defaultValue="5000" onFocus={onAllowanceChange} onChange={onAllowanceChange} required autoFocus className="allowance-amount" />SC
				<div className="allowance-buttons">
					<button type="submit" className="allowance-button-accept">Accept</button>
					<button type="button" onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
				</div>
			</form>
			<span> Estimated Fees: {feeEstimate} SC </span>
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
	feeEstimate: PropTypes.number.isRequired,
	storageEstimate: PropTypes.string.isRequired,
}

export default AllowanceDialog
