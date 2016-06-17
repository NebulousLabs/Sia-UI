import React, { PropTypes } from 'react'
import StoragePlan from './storageplan.js'

const AllowanceDialog = ({storageSize, storageCost, settingAllowance, allowanceProgress, actions}) => {
	const setStorageSize = (size) => actions.calculateStorageCost(size)
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = () => actions.setAllowance(storageCost)

	let dialogContents
	if (settingAllowance) {
		dialogContents = (
			<div className="allowance-dialog">
				<div>
					<h2> Buying {storageSize} GB of storage for a total of {storageCost} SC... </h2>
					<h3> {allowanceProgress}% complete... </h3>
				</div>
			</div>
		)
	} else {
		dialogContents = (
			<div className="allowance-dialog">
				<h3> Buy storage on the Sia Decentralized Network</h3>
				<div className="storage-plans">
					<StoragePlan storageSize={'10'} currentStorageSize={storageSize} setStorageSize={setStorageSize} />
					<StoragePlan storageSize={'100'} currentStorageSize={storageSize} setStorageSize={setStorageSize} />
					<StoragePlan storageSize={'250'} currentStorageSize={storageSize} setStorageSize={setStorageSize} />
				</div>
				<p> Estimated 3-month cost: {Math.floor(storageCost)} SC </p>
				<p className="allowance-warning">Any unused funds will be refunded.</p>
				<div className="allowance-buttons">
					<button onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
					<button onClick={onAcceptClick} className="allowance-buttons">Accept</button>
				</div>
			</div>
		)
	}
	return (
		<div className="modal">
			{dialogContents}
		</div>
	)
}

AllowanceDialog.propTypes = {
	storageSize: PropTypes.string.isRequired,
	storageCost: PropTypes.string.isRequired,
	allowanceProgress: PropTypes.string,
	settingAllowance: PropTypes.bool.isRequired,
}

export default AllowanceDialog
