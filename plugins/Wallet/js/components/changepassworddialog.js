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
		<div className="modal">
			<form className="change-password-form" onSubmit={handleChangePasswordClick}>
				<h3> Enter your current password, and the new password you wish to replace it with. </h3>
				<input className="currentpassword-input" type="password" name="currentpassword" autoFocus />
				<input className="newpassword-input" type="password" name="newpassword" />
				<input className="newpassword-again-input" type="password" name="newpassword-again" />
				<div className="change-password-buttons">
					<button type="submit">Change Password</button>
					<button className="change-password-cancel" onClick={handleCancelClick}>Cancel</button>
				</div>
				<div className="change-password-error">{changePasswordError}</div>
			</form>
		</div>
	)
}

ChangePasswordDialog.propTypes = {
	changePasswordError: PropTypes.string.isRequired,
}

export default ChangePasswordDialog

