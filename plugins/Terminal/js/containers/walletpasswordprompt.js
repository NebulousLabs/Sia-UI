import WalletPasswordPromptView from '../components/walletpasswordprompt.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCommand, updateCommand, endCommand, setWalletPassword, hideWalletPrompt, showSeedPrompt, hideCommandOverview } from '../actions/commandline.js'

const mapStateToProps = (state) => ({
	showWalletPrompt: state.commandLineReducer.get('showWalletPrompt'),
	currentCommand: state.commandLineReducer.get('currentCommand'),
	commandHistory: state.commandLineReducer.get('commandHistory'),
	walletPassword: state.commandLineReducer.get('walletPassword'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addCommand, updateCommand, endCommand, setWalletPassword, hideWalletPrompt, showSeedPrompt, hideCommandOverview }, dispatch),
})

const WalletPasswordPrompt = connect(mapStateToProps, mapDispatchToProps)(WalletPasswordPromptView)
export default WalletPasswordPrompt
