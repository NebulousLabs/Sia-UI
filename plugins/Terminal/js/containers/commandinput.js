import CommandInputView from '../components/commandinput.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCommand, updateCommand, endCommand, loadPrevCommand, loadNextCommand,
	setCurrentCommand, showWalletPrompt, hideWalletPrompt,
	showCommandOverview, hideCommandOverview } from '../actions/commandline.js'

const mapStateToProps = (state) => ({
	currentCommand: state.commandLineReducer.get('currentCommand'),
	commandIndex: state.commandLineReducer.get('commandIndex'),
	showCommandOverview: state.commandLineReducer.get('showCommandOverview'),
	commandRunning: state.commandLineReducer.get('commandRunning'),
	commandHistory: state.commandLineReducer.get('commandHistory'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addCommand, updateCommand, endCommand,
		loadPrevCommand, loadNextCommand, setCurrentCommand,
		showWalletPrompt, hideWalletPrompt, showCommandOverview,
		hideCommandOverview }, dispatch),
})

const CommandInput = connect(mapStateToProps, mapDispatchToProps)(CommandInputView)
export default CommandInput
