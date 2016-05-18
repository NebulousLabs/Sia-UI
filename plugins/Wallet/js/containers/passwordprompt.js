import PasswordPromptView from '../components/passwordprompt.js';
import { handlePasswordChange } from '../actions/passwordprompt.js';
import { unlockWallet } from '../actions/locking.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	password: state.passwordprompt.get('password'),
});
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ handlePasswordChange, unlockWallet }, dispatch),
});

const PasswordPrompt = connect(mapStateToProps, mapDispatchToProps)(PasswordPromptView)
export default PasswordPrompt
