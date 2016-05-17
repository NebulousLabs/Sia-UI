import React, { propTypes } from 'react';
import UnlockButton from '../containers/unlockbutton.js'

const LockScreen = ({unlocked}) => (
	<div className={unlocked ? "lockscreen unlocked" : "lockscreen locked"}>
		<UnlockButton />
	</div>
);

export default LockScreen;