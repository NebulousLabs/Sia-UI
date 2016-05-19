import React, { PropTypes } from 'react';

const PasswordPrompt = ({visible, password, error, actions}) => {
	if (!visible) {
		return (
			<div></div>
		);
	}
	const onPasswordChange = (e) => actions.handlePasswordChange(e.target.value);
	const onUnlockClick = () => actions.unlockWallet(password);
	return (
		<div className="password-prompt">
			<input value={password} className="password-input" onChange={onPasswordChange} />
			<button onClick={onUnlockClick}>Unlock</button>
			<div className="password-prompt-error">{error}</div>
		</div>
	);
}
PasswordPrompt.propTypes = {
	visible: PropTypes.bool.isRequired,
	password: PropTypes.string.isRequired,
	error: PropTypes.string,
}

export default PasswordPrompt;
