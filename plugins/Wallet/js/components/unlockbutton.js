import React from 'react';

const UnlockButton = ({actions}) => (
	<div className="unlock-button">
		<i onClick={actions.startPasswordPrompt} className="fa fa-lock fa-4x"></i>
	</div>
);

export default UnlockButton;