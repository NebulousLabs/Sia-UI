import React, { propTypes } from 'react';

const LockScreen = ({unlocked}) => (
	<div className={unlocked ? "lockscreen unlocked" : "lockscreen locked"}>
	</div>
);

export default LockScreen;