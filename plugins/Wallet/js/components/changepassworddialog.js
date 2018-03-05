import React from 'react'
import PropTypes from 'prop-types'

const ChangePasswordDialog = ({changePasswordError, actions}) => {
	const handleChangePasswordClick = (e) => {
		e.preventDefault()
		if (e.target.newpassword.value !== e.target['newpassword-again'].value) {
			actions.setChangePasswordError('passwords did not match!')
			return
		}
		actions.changePassword(e.target.currentpassword.value, e.target.newpassword.value)
	}
	const handleCancelClick = (e) => {
		e.preventDefault()
		actions.hideChangePasswordDialog()
	}

	return (
		<div className="dialog">
			<form className="change-password-form" onSubmit={handleChangePasswordClick}>
				<h3 className="dialog__title">
					Enter your current password, and the new password you wish to replace it with.
				</h3>
				<div className="dialog__content">
					<input className="input currentpassword-input" type="password" placeholder="Current password" name="currentpassword" autoFocus />
					<input className="input newpassword-input" type="password" placeholder="New password" name="newpassword" />
					<input className="input newpassword-again-input" type="password" placeholder="New password again" name="newpassword-again" />
					<div className="change-password-error">{changePasswordError}</div>
				</div>
				<div className="dialog__actions change-password-buttons">
					<button className="change-password-cancel button" onClick={handleCancelClick}>Cancel</button>
					<button className="button button--primary" type="submit">Change Password</button>
				</div>
			</form>
		</div>
	)
}

ChangePasswordDialog.propTypes = {
	changePasswordError: PropTypes.string.isRequired,
}

export default ChangePasswordDialog

