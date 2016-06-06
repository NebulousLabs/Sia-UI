import React, { PropTypes } from 'react'

const AllowanceDialog = ({storageSize, storageCost, actions}) => {
	const onStorageSizeChange = (e) => actions.handleStorageSizeChange(e.target.value)
	const onCancelClick = () => actions.closeAllowanceDialog()
	return (
		<div className="modal">
			<div className="allowance-dialog">
				<h3> How many gigabytes of storage do you want per month? </h3>
				<input value={storageSize} onChange={onStorageSizeChange}></input> GB
				<span className="storage-cost">{storageCost}</span>
				<div className="allowance-buttons">
					<button onClick={onCancelClick} className="allowance-button-cancel">Cancel</button>
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
