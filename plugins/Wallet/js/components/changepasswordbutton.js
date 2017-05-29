import React from 'react'

const ChangePasswordButton = ({actions}) => {
	const handleChangePasswordClick = () => actions.showChangePasswordDialog()
	return (
		<div className="change-password-button" onClick={handleChangePasswordClick}>
			<i className="fa fa-gear fa-2x" />
			<span> Change Password</span>
		</div>
	)
}

export default ChangePasswordButton

