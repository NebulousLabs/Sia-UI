import ReceivePromptView from '../components/receiveprompt.js';
import { connect } from 'react-redux';
import { hideReceivePrompt } from '../actions/wallet.js';
import { bindActionCreators } from 'redux';

const mapStateToProps = (state) => ({
	visible: state.receiveprompt.get('visible'),
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideReceivePrompt }, dispatch),
});

const ReceivePrompt = connect(mapStateToProps, mapDispatchToProps)(ReceivePromptView);
export default ReceivePrompt;
