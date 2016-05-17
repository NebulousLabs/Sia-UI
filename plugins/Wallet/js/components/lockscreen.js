import React, { propTypes } from 'react';

const LockScreen = ({unlocked}) => (
	<div className={unlocked ? "lockscreen unlocked" : "lockscreen locked"}>
		test
	</div>
);

export default LockScreen;