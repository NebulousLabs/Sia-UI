import PropTypes from 'prop-types'
import React from 'react'

const ConfirmationDialog = ({allowance, onConfirmClick, onCancelClick}) => {
	const confirmationStyle = {
		'padding': '40px 40px 40px 40px',
		'display': 'flex',
		'flexDirection': 'column',
		'alignItems': 'center',
		'justifyContent': 'space-around',
		'backgroundColor': '#ececec',
		'width': '50%',
		'height': '400px',
	}
	const buttonStyle = {
		'marginLeft': '5px',
		'marginRight': '5px',
	}
	const confirmationTextStyle = {
		'marginBottom': '20px',
		'fontSize': '24px',
	}
	return (
		<div style={confirmationStyle}>
			<h3 style={confirmationTextStyle}>
				Please confirm that you would like to set aside {allowance} SC for storage on the Sia network.
			</h3>
			<div>
				<button style={buttonStyle} onClick={onConfirmClick}>Confirm</button>
				<button style={buttonStyle} onClick={onCancelClick}>Cancel</button>
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
