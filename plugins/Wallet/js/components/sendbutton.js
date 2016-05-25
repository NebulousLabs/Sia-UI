import React from 'react';

const SendButton = ({actions}) => (
	<div onClick={actions.startSendPrompt} className="send-button">
		<i className="fa fa-paper-plane fa-4x"></i>
		<span>Send Siacoin</span>
	</div>
);
export default SendButton