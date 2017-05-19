import React from 'react'
import PropTypes from 'prop-types'

const ConfirmationDialog = ({seed, password, error, actions}) => {
	const onCancelClick = () => actions.hideConfirmationDialog()
	const onOkClick = (e) => {
		e.preventDefault()
		if (e.target.seed.value === seed && e.target.password.value === password) {
			actions.dismissNewWalletDialog()
		} else if (e.target.seed.value !== seed) {
			actions.setConfirmationError('seed did not match!')
		} else if (e.target.password.value !== password) {
			actions.setConfirmationError('password did not match!')
		}
	}
	return (
		<div className="modal">
			<div className="confirmation-dialog">
				<h3> Please confirm your password and seed to continue </h3>
				<form className="seed-confirmation-form" onSubmit={onOkClick}>
					<input className="seed-confirmation-input" placeholder="seed" type="text" name="seed" required />
					<input className="password-confirmation-input" placeholder="password" type="text" name="password" required />
					<div className="confirmation-buttons">
						<button onClick={onCancelClick}>Go Back</button>
						<button className="seed-confirmation-button" type="submit">Confirm</button>
					</div>
				</form>
				<span className="seed-confirmation-error">{error}</span>
			</div>
		</div>
	)
}

ConfirmationDialog.propTypes = {
	seed: PropTypes.string.isRequired,
	password: PropTypes.string.isRequired,
	error: PropTypes.string.isRequired,
}

export default ConfirmationDialog
