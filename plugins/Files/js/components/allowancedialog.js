import React, { PropTypes } from 'react'
import BigNumber from 'bignumber.js'

const allowanceMonths = 3

const AllowanceDialog = ({storageSize, storageCost, settingAllowance, actions}) => {
	const onStorageSizeChange = (e) => actions.handleStorageSizeChange(e.target.value)
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = () => actions.setAllowance(storageCost)

	let dialogContents
	if (settingAllowance) {
		dialogContents = (
			<div className="allowance-dialog">
				<h2> Buying {storageSize} GB of storage for a total of {storageCost} SC... </h2>
			</div>
		)
	} else {
		dialogContents = (
			<div className="allowance-dialog">
				<h3> How many gigabytes of storage do you want per month? </h3>
				<input type="number" value={storageSize} onChange={onStorageSizeChange}></input> GB
				<div className="storage-cost">
					<div>Cost per month: {new BigNumber(storageCost).dividedBy(allowanceMonths).round(2).toString()} SC</div>
					<div>Months: {allowanceMonths}</div>
					<div>Total: {storageCost} SC</div>
				</div>
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
	settingAllowance: PropTypes.bool.isRequired,
}

export default AllowanceDialog
