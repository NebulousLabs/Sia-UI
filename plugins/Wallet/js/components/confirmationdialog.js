import React from 'react'
import PropTypes from 'prop-types'

const ConfirmationDialog = ({seed, error, actions}) => {
	const onCancelClick = () => actions.hideConfirmationDialog()
	const onOkClick = (e) => {
		e.preventDefault()
		if (e.target.seed.value === seed) {
			actions.dismissNewWalletDialog()
		} else {
			actions.setConfirmationError('seed did not match!')
		}
	}
	return (
		<div className="modal">
			<div className="confirmation-dialog">
				<h3> Please confirm your seed to continue </h3>
				<span className="seed-confirmation-error">{error}</span>
				<form className="seed-confirmation-form" onSubmit={onOkClick}>
					<input className="seed-confirmation-input" type="text" name="seed" required autoFocus />
					<div className="confirmation-buttons">
						<button onClick={onCancelClick}>Go Back</button>
						<button className="seed-confirmation-button" type="submit">Confirm</button>
					</div>
				</form>
			</div>
		</div>
	)
}

ConfirmationDialog.propTypes = {
	seed: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
}

export default ConfirmationDialog
