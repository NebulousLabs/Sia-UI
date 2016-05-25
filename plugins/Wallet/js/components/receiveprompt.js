import React, { PropTypes } from 'react'
import AddressList from '../containers/addresslist.js';

const ReceivePrompt = ({visible, actions}) => {
	if (!visible) {
		return (
			<div></div>
		);
	}
	return (
		<div className="receive-prompt">
			You can receive Siacoins using any of the following addresses:
			<AddressList />
			<button className="receiveprompt-dismissbtn" onClick={actions.hideReceivePrompt}>OK</button>
		</div>
	)
}
ReceivePrompt.propTypes = {
	visible: PropTypes.bool,
};
export default ReceivePrompt;
