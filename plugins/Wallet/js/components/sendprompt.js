import React, { PropTypes } from 'react';

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
		<div className="modal">
			<div className="sendprompt">
				<div className="sendamount">
					<h3>Send Amount (SC) </h3>
					<input onChange={onSendAmountChange}></input>
				</div>
				<div className="sendaddress">
					<h3> To Address </h3>
					<input onChange={onSendAddressChange}></input>
				</div>
				<div className="send-prompt-buttons">
					<button className="cancel-send-button" onClick={actions.closeSendPrompt}>Cancel</button>
					<button className="send-siacoin-button" onClick={onSendClick}>Send</button>
				</div>
			</div>
		</div>
	);
}
export default SendPrompt;