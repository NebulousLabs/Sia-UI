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
				Send
				<input onChange={onSendAmountChange}></input>
				SC
			</div>
			<div className="sendaddress">
				To <input onChange={onSendAddressChange}></input>
			</div>
		</div>
	);
}
export default SendPrompt;
