import React from 'react';

const SendButton = ({actions}) => (
	<div onClick={actions.startSendPrompt} className="send-button">
		Send Siacoin
	</div>
);
export default SendButton