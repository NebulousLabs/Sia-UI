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
			<h2>Your wallet has been secured</h2>
			<p className="password-prompt__description">
				Enter your wallet password to access your wallet.
			</p>
			<form
				onSubmit={onUnlockClick}
			>
				<input type="password" value={password} className="input password-input" onChange={onPasswordChange} />
				<input
					className="unlock-button button button--primary"
					type="submit"
					value="Unlock"
					disabled={!(password && password.length > 0)}
				/>
			</form>
			<div className="password-prompt__error">{error}</div>
		</div>
	)
}
PasswordPrompt.propTypes = {
	password: PropTypes.string.isRequired,
	error: PropTypes.string,
}

export default PasswordPrompt
