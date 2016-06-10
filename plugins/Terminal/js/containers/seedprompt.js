import WalletSeedPromptView from '../components/seedprompt.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCommand, updateCommand, hideSeedPrompt, hideCommandOverview } from '../actions/commandline.js'

const mapStateToProps = (state) => ({
    showSeedPrompt: state.commandLineReducer.get('showSeedPrompt'),
    currentCommand: state.commandLineReducer.get('currentCommand')
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addCommand, updateCommand, hideSeedPrompt, hideCommandOverview }, dispatch)
})

const WalletSeedPrompt = connect(mapStateToProps, mapDispatchToProps)(WalletSeedPromptView)
export default WalletSeedPrompt
