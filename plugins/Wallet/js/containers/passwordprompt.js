import PasswordPromptView from '../components/passwordprompt.js';
import { handlePasswordChange } from '../actions/passwordprompt.js';
import { unlockWallet } from '../actions/wallet.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	visible: state.passwordprompt.get('visible'),
	password: state.passwordprompt.get('password'),
	error: state.passwordprompt.get('error'),
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ handlePasswordChange, unlockWallet }, dispatch),
});

const PasswordPrompt = connect(mapStateToProps, mapDispatchToProps)(PasswordPromptView)
export default PasswordPrompt;