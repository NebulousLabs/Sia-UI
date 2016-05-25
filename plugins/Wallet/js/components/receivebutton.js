import React from 'react';

const ReceiveButton = ({actions}) => (
	<div className="receive-button" onClick={actions.showReceivePrompt}>
		<i className="fa fa-download fa-4x"></i>
		<span>Receive Siacoin</span>
	</div>
);
export default ReceiveButton;
