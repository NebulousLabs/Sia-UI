import PropTypes from 'prop-types'
import React from 'react'

const PasswordPrompt = ({password, error, unlocking, actions}) => {
	const onPasswordChange = (e) => actions.handlePasswordChange(e.target.value)
	const onUnlockClick = () => actions.unlockWallet(password)
	if (unlocking) {
		return (
			<span className="unlock-status"> Unlocking your wallet, this may take a while (up to several minutes)... </span>
		)
	}
	return (
		<div className="password-prompt">
			<h2> Wallet Locked </h2>
			<span> Enter your wallet password to unlock the wallet. </span>
			<i className="fa fa-lock fa-4x" />
			<input type="password" value={password} className="password-input" onChange={onPasswordChange} />
			<button className="unlock-button" onClick={onUnlockClick}>Unlock</button>
			<div className="password-prompt-error">{error}</div>
		</div>
	)
}
PasswordPrompt.propTypes = {
	password: PropTypes.string.isRequired,
	error: PropTypes.string,
}

export default PasswordPrompt
