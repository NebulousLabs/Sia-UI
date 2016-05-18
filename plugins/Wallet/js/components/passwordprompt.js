import React, { PropTypes } from 'react';

const PasswordPrompt = ({password, actions}) => {
	const onPasswordChange = (e) => actions.handlePasswordChange(e.target.value);
	const onUnlockClick = () => actions.unlockWallet(password);

	return (
		<div className="password-prompt">
			<input value={password} className="password-input" onChange={onPasswordChange} />
			<button onClick={onUnlockClick}>Unlock</button>
		</div>
	);
}
PasswordPrompt.propTypes = {
	password: PropTypes.string.isRequired,
}

export default PasswordPrompt;
