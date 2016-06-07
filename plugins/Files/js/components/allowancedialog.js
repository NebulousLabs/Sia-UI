import React, { PropTypes } from 'react'
import BigNumber from 'bignumber.js'

const allowanceHosts = 24
const blockMonth = 4382
const allowanceMonths = 3

const AllowanceDialog = ({storageSize, storageCost, actions}) => {
	const onStorageSizeChange = (e) => actions.handleStorageSizeChange(e.target.value)
	const onCancelClick = () => actions.closeAllowanceDialog()
	const onAcceptClick = () => {
		const allowance = {
			funds: SiaAPI.siacoinsToHastings(storageCost).toString(),
			hosts: allowanceHosts,
			period: oneMonthPeriod,
		}
		actions.setAllowance(allowance)
	}
	return (
		<div className="modal">
			<div className="allowance-dialog">
				<h3> How many gigabytes of storage do you want per month? </h3>
				<input type="number" value={storageSize} onChange={onStorageSizeChange}></input> GB
				<div className="storage-cost">
					<div>Cost per month: {new BigNumber(storageCost).dividedBy(allowanceMonths).round(2).toString()} SC</div>
					<div>Prepaid Months: {allowanceMonths}</div>
					<div>Total: {storageCost}</div>
				</div>
				<div className="allowance-buttons">
					<button onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
					<button onClick={onAcceptClick} className="allowance-buttons">Accept</button>
				</div>
			</div>
		</div>
	)
}

AllowanceDialog.propTypes = {
	storageSize: PropTypes.string.isRequired,
	storageCost: PropTypes.string.isRequired,
}

export default AllowanceDialog
