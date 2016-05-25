import React, { PropTypes } from 'react';

const SendPrompt = ({visible, sendAddress, sendAmount, actions}) => {
	const onSendAddressChange = (e) => actions.setSendAddress(e.target.value);
	const onSendAmountChange = (e) => actions.setSendAmount(e.target.value);

	if (!visible) {
		return (
			<div></div>
		);
	}
	return (
		<div className="sendprompt">
			<div className="sendamount">
				<span>Send Amount (SC): </span>
				<input onChange={onSendAmountChange}></input>
			</div>
			<div className="sendaddress">
				<span>To Address:</span>
				<input onChange={onSendAddressChange}></input>
			</div>
			<button className="send-button" onClick={actions.sendSiacoins}>Send</button>
		</div>
	);
}
export default SendPrompt;
