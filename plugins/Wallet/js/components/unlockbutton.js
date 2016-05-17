import React, { propTypes } from 'react';

const UnlockButton = ({actions}) => (
	<div className="unlock-button">
		<i onClick={actions.unlockWallet} className="fa fa-lock"></i>
	</div>
);

export default UnlockButton;