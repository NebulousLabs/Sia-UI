import CommandInputView from '../components/commandinput.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addCommand, updateCommand } from '../actions/commandline.js'

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ addCommand, updateCommand }, dispatch)
})

const CommandInput = connect(mapStateToProps, mapDispatchToProps)(CommandInputView)
export default CommandInput
