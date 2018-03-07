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
		<div className="confirmation-dialog">
			<div className="dialog">
				<h3 className="dialog__title"> Please input your password and seed to continue </h3>
				<form className="seed-confirmation-form" onSubmit={onOkClick}>
					<div className="dialog__content">
						<input className="input seed-confirmation-input" placeholder="seed" type="text" name="seed" required />
						<input className="input password-confirmation-input" placeholder="password" type="text" name="password" required />
						<span className="seed-confirmation-error">{error}</span>
					</div>
					<div className="dialog__actions confirmation-buttons">
						<button className="button" onClick={onCancelClick}>Go Back and Review</button>
						<button className="button button--primary seed-confirmation-button" type="submit">Confirm</button>
					</div>
				</form>
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
