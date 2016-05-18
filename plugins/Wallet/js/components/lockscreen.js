import React, { PropTypes } from 'react';
import UnlockButton from '../containers/unlockbutton.js'

const LockScreen = ({unlocked}) => (
	<div className={unlocked ? "lockscreen unlocked" : "lockscreen locked"}>
		<UnlockButton />
	</div>
);
LockScreen.propTypes = {
	unlocked: PropTypes.bool,
}

export default LockScreen;
