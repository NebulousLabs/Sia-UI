import React, { PropTypes } from 'react'
import StoragePlan from './storageplan.js'
import BigNumber from 'bignumber.js'

const allowanceMonths = 3

const AllowanceDialog = ({storageSize, storageCost, settingAllowance, allowanceProgress, actions}) => {
	const setStorageSize = (size) => actions.calculateStorageCost(size)
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = () => actions.setAllowance(storageCost)

	let dialogContents
	if (settingAllowance) {
		dialogContents = (
			<div className="allowance-dialog">
				<h2> Buying {storageSize} GB of storage for a total of {storageCost} SC... </h2>
				<h3> {allowanceProgress}% complete... </h3>
			</div>
		)
	} else {
		dialogContents = (
			<div className="allowance-dialog">
				<h3> How many gigabytes of storage do you want per month? </h3>
				<div className="storage-plans">
					<StoragePlan storageSize={'10'} setStorageSize={setStorageSize} />
					<StoragePlan storageSize={'100'} setStorageSize={setStorageSize} />
					<StoragePlan storageSize={'250'} setStorageSize={setStorageSize} />
				</div>
				<p> Estimated monthly cost: {Math.floor(storageCost/3)} SC </p>
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
