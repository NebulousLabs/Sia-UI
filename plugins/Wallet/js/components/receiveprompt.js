import React, { PropTypes } from 'react'

const ReceivePrompt = ({address, visible, actions}) => {
	if (!visible) {
		return (
			<div></div>
		);
	}
	return (
		<div className="receive-prompt">
			You can receive Siacoins using the following address:
			<div className="wallet-address">{ address }</div>
			<button className="receiveprompt-dismissbtn" onClick={actions.hideReceivePrompt}>OK</button>
		</div>
	)
}
ReceivePrompt.propTypes = {
	visible: PropTypes.bool,
};
export default ReceivePrompt;
