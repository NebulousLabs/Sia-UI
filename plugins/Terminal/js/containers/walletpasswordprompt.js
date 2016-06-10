import WalletPasswordPromptView from '../components/walletpasswordprompt.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCommand, updateCommand, hideWalletPrompt, showSeedPrompt, hideCommandOverview } from '../actions/commandline.js'

const mapStateToProps = (state) => ({
    showWalletPrompt: state.commandLineReducer.get('showWalletPrompt'),
    currentCommand: state.commandLineReducer.get('currentCommand')
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addCommand, updateCommand, hideWalletPrompt, showSeedPrompt, hideCommandOverview }, dispatch)
})

const WalletPasswordPrompt = connect(mapStateToProps, mapDispatchToProps)(WalletPasswordPromptView)
export default WalletPasswordPrompt
