import SendPromptView from '../components/sendprompt.js';
import { setSendAddress, setSendAmount, closeSendPrompt, sendSiacoin } from '../actions/wallet.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	visible: state.sendprompt.get('visible'),
	sendAddress: state.sendprompt.get('sendaddress'),
	sendAmount: state.sendprompt.get('sendamount'),
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeSendPrompt, setSendAddress, setSendAmount, sendSiacoin }, dispatch),
});

const SendPrompt = connect(mapStateToProps, mapDispatchToProps)(SendPromptView);
export default SendPrompt;
