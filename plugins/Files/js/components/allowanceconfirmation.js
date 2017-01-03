import React, { PropTypes } from 'react'

const ConfirmationDialog = ({allowance, onConfirmClick, onCancelClick}) => {
	const confirmationStyle = {
	}
	const confirmationTextStyle = {
	}
	const confirmationButtonStyle = {
	}
	return (
		<div style={confirmationStyle}>
			<span style={confirmationTextStyle}>
				Please confirm that you would like to set aside {allowance} SC for storage on the Sia network.
			</span>
			<div style={confirmationButtonStyle}>
				<button onClick={onConfirmClick}>Confirm</button>
				<button onClick={onCancelClick}>Cancel</button>
			</div>
		</div>
	)
}

ConfirmationDialog.propTypes = {
	allowance: PropTypes.string.isRequired,
	onConfirmClick: PropTypes.func.isRequired,
	onCancelClick: PropTypes.func.isRequired,
}

export default ConfirmationDialog
