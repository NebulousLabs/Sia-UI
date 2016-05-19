import React, { PropTypes } from 'react';
import UnlockButton from '../containers/unlockbutton.js';
import PasswordPrompt from '../containers/passwordprompt.js';

const LockScreen = ({unlocked}) => (
	<div className={unlocked ? "lockscreen unlocked" : "lockscreen locked"}>
		<UnlockButton />
		<PasswordPrompt />
	</div>
);
LockScreen.propTypes = {
	unlocked: PropTypes.bool,
}

export default LockScreen;
