import React, { PropTypes } from 'react';

// SendPrompt defines the component for sending siacoins to an address.
const SendPrompt = ({visible, sendAddress, sendAmount, actions}) => {
	const onSendAddressChange = (e) => actions.setSendAddress(e.target.value);
	const onSendAmountChange = (e) => actions.setSendAmount(e.target.value);
	const onSendClick = () => actions.sendSiacoin(sendAddress, sendAmount);

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
			<div className="send-prompt-buttons">
				<button className="cancel-send-button" onClick={actions.closeSendPrompt}>Cancel</button>
				<button className="send-siacoin-button" onClick={onSendClick}>Send</button>
			</div>
		</div>
	);
}
export default SendPrompt;