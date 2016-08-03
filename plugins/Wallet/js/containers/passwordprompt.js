import PasswordPromptView from '../components/passwordprompt.js'
import { unlockWallet, handlePasswordChange } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	password: state.passwordprompt.get('password'),
	error: state.passwordprompt.get('error'),
	unlocking: state.wallet.get('unlocking'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ handlePasswordChange, unlockWallet }, dispatch),
})

const PasswordPrompt = connect(mapStateToProps, mapDispatchToProps)(PasswordPromptView)
export default PasswordPrompt
